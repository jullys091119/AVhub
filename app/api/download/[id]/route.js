export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import archiver from "archiver";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Buscar recurso en Firestore
    const ref = doc(db, "recursos", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json(
        {
          error: "Recurso no encontrado",
        },
        {
          status: 404,
        },
      );
    }

    const data = snap.data();

    const archivos = data.archivos || [];

    if (!Array.isArray(archivos) || archivos.length === 0) {
      return NextResponse.json(
        {
          error: "El recurso no tiene archivos",
        },
        {
          status: 400,
        },
      );
    }

    const zip = await new Promise(async (resolve, reject) => {
      const chunks = [];

      const archive = archiver("zip", {
        zlib: {
          level: 9,
        },
      });

      archive.on("data", (chunk) => {
        chunks.push(chunk);
      });

      archive.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      archive.on("error", (error) => {
        console.error("ARCHIVER ERROR:", error);
        reject(error);
      });

      try {
        for (const archivo of archivos) {
          console.log("Agregando:", archivo.nombre);

          const response = await fetch(archivo.url);

          if (!response.ok) {
            throw new Error(`No se pudo descargar ${archivo.nombre}`);
          }

          const buffer = await response.arrayBuffer();

          archive.append(Buffer.from(buffer), {
            name: archivo.nombre,
          });
        }

        await archive.finalize();
      } catch (error) {
        reject(error);
      }
    });

    return new NextResponse(zip, {
      headers: {
        "Content-Type": "application/zip",

        "Content-Disposition": `attachment; filename="${data.nombre || "recurso"}.zip"`,

        "Content-Length": zip.length.toString(),
      },
    });
  } catch (error) {
    console.error("ERROR ZIP:", error);

    return NextResponse.json(
      {
        error: "No se pudo crear el ZIP",
        detalle: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
