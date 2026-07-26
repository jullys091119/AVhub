import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();

    const images = formData.getAll("images");
    const folderId = formData.get("folderId");

    const uploads = await Promise.all(
      images.map(async (image) => {

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              upload_preset: "resources talks",
              folder: `avhub/recursos/${folderId}`,
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(buffer);
        });

        return {
          nombre: image.name,
          url: result.secure_url,
        };
      })
    );

    return Response.json({
      ok: true,
      archivos: uploads,
    });

  } catch (error) {
    console.log("ERROR CLOUDINARY:", error);

    return Response.json(
      { 
        error: error.message 
      },
      { status: 500 }
    );
  }
}