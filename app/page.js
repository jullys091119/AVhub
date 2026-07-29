"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Login from "./components/Login";

import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";

import { ChevronDownIcon } from "lucide-react";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { InputField, Input } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import AlertSuccess from "./components/AlertSuccess";
import AlertError from "./components/AlertError";

import { db } from "@/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import { UserRoundCog } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [success, setSucces] = useState(false);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const [talks, setTalks] = useState("");
  const [songs, setSongs] = useState([]);
  const [num, setNum] = useState("");
  const [sqlPass, sqlSetPass] = useState("");
  const [tel, setTel] = useState("");
  const [president, setPresident] = useState("");


  const [loading, setLoading] = useState(false);

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openGallery = () => {
    fileInputRef.current.click();
  };

  const handleFiles = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const getSongs = async () => {
    try {
      const res = await fetch(
        "https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=sjjm&fileformat=MP3&alllangs=0&langwritten=S&txtCMSLang=S",
      )
        .then((response) => response.json())
        .then((data) => data);

      const song = [];

      res.files.S.MP3.map((item) => {
        if (!item.title.includes("(con audiodescripciones)")) {
          song.push(item.title);
        }
      });

      setSongs(song);
    } catch (error) {
      console.log("Error al obtener la lista de canciones", error);
    }
  };

  async function sendDataResources() {
    try {
      if (!talks || !name) {
        setError(true);
        return;
      }

      // inicia spinner
      setLoading(true);

      const docRef = await addDoc(collection(db, "recursos"), {
        nombre: name,
        fecha: new Date(),
        bosquejos: talks,
        archivos: [],
        alabanza: num,
      });

      const idRecurso = docRef.id;

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("folderId", idRecurso);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      await updateDoc(doc(db, "recursos", idRecurso), {
        archivos: data.archivos,
      });

      sendWhatsapPresident();

      // LIMPIAR FORMULARIO
      setName("");
      setTalks("");
      setNum("");
      setFiles([]);

      setSucces(true);
    } catch (error) {
      console.log(error, "No se pudo insertar");
      setError(true);
    } finally {
      // quitar spinner siempre
      setLoading(false);
    }
  }

  useEffect(() => {
    getSongs();

    if (success || error) {
      setTimeout(() => {
        setSucces(false);
        setError(false);
      }, 4000);
    }
  }, [success, error]);

  useEffect(() => {
    const login = async () => {
      const querySnapshot = await getDocs(collection(db, "password"));
      const president = await getDocs(collection(db, "presidente"));

      let passData = "";

      querySnapshot.forEach((doc) => {
        passData = doc.data();
      });

      if (passData && passData.pass) {
        sqlSetPass(passData.pass);
      }

      let currentPresident = "";

      president.forEach((doc) => {
        currentPresident = doc.data();
      });

      setTel(currentPresident.tel);
      setPresident(currentPresident.nombre);
    };

    login();
  }, []);

  function sendWhatsapPresident() {
    const msg = `
👋 Hola ${president}

📢 Ya están disponibles los recursos del discurso.

👤 Discursante: ${name}

📄 Bosquejo: ${talks}

🎵 Alabanza: ${num}

🔗 Recursos disponibles en AVHub
`;

    const url = `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank");
  }
  return (
    <div className="container">
      <Box className="w-full bg-primary/30 flex flex-row items-center justify-between p-5 pointer">
        <p className="font-bold text-lg">AVHub</p>

        <Box className="flex flex-row gap-5 items-center">
          <p className="pointer">Recursos</p>

          <Button
            className="flex gap-2 bg-sky-500/100 items-center justify-center"
            onPress={() => setIsLoginOpen(true)}
          >
            <UserRoundCog size={16} className="text-white" />
            <p className="text-white">Admin</p>
          </Button>

          <Login
            sqlPass={sqlPass}
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSuccess={() => {
              setIsLoginOpen(false);
              router.push("/admin");
            }}
          />
        </Box>
      </Box>

      <main className="menu p-5">
        <Heading size="xl">Subir Recursos</Heading>

        <Box className="gap-6 mt-10">
          {success && <AlertSuccess />}
          {error && <AlertError />}

          <Input isRequired="true">
            <InputField
              placeholder="Nombre del discursante"
              value={name}
              onChangeText={(e) => setName(e)}
            />
          </Input>

          <Select
            onValueChange={(value) => {
              setTalks(value);
            }}
          >
            <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder="Seleccionar bosquejo" />

              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>

            <SelectPortal>
              <SelectBackdrop />

              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>

                <SelectItem label="Discurso 1" value="Discurso 1" />
                <SelectItem label="Discurso 2" value="Discurso 2" />
                <SelectItem label="Discurso 3" value="Discurso 3" />
                <SelectItem label="Discurso 4" value="Discurso 4" />
                <SelectItem label="Discurso 5" value="Discurso 5" />
                <SelectItem label="Discurso 6" value="Discurso 6" />
              </SelectContent>
            </SelectPortal>
          </Select>

          <Select
            onValueChange={(value) => {
              setNum(value);
            }}
          >
            <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder="Seleccionar Alabanza" />

              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>

            <SelectPortal>
              <SelectBackdrop />

              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>

                {songs.map((i, index) => (
                  <SelectItem label={i} value={i} key={index} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>

          <Button onPress={openGallery} className="pointer" disabled={loading}>
            <ButtonText>Subir imágenes</ButtonText>
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={() => {
              handleFiles(Array.from(fileInputRef.current.files));
            }}
          />

          {files.length > 0 && (
            <Box className="mt-5">
              <Heading size="md">Archivos seleccionados</Heading>

              {files.map((file, index) => (
                <p key={index}>📷 {file.name}</p>
              ))}
            </Box>
          )}

          <Button
            className="bg-sky-500/100"
            variant="default pointer"
            size="default"
            disabled={loading}
            onPress={() => sendDataResources(files)}
          >
            <ButtonText className="text-white">
              {loading ? "⏳ Enviando recursos..." : "Enviar a AVHub"}
            </ButtonText>
          </Button>
        </Box>
      </main>
    </div>
  );
}
