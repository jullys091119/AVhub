"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

import { ChevronDownIcon, UserRoundCog } from "lucide-react";

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
      );

      const data = await res.json();

      const song = [];

      data.files.S.MP3.map((item) => {
        if (!item.title.includes("(con audiodescripciones)")) {
          song.push(item.title);
        }
      });

      setSongs(song);
    } catch (error) {
      console.log("Error al obtener canciones", error);
    }
  };

  async function sendDataResources() {
    try {
      if (!talks || !name) {
        setError(true);
        return;
      }

      setLoading(true);

      const docRef = await addDoc(collection(db, "recursos"), {
        nombre: name,
        fecha: new Date(),
        bosquejos: talks,
        archivos: [],
        alabanza: num,
      });

      const idRecurso = docRef.id;

      let archivos = [];

      if (files.length > 0) {
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

        console.log("Respuesta upload:", data);

        archivos = data.archivos || [];
      }

      await updateDoc(doc(db, "recursos", idRecurso), {
        archivos,
      });

      sendWhatsapPresident();

      setName("");
      setTalks("");
      setNum("");
      setFiles([]);

      setSucces(true);
    } catch (error) {
      console.log(error, "No se pudo insertar");

      setError(true);
    } finally {
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
      const presidentSnapshot = await getDocs(collection(db, "presidente"));

      let passData = "";

      querySnapshot.forEach((doc) => {
        passData = doc.data();
      });

      if (passData?.pass) {
        sqlSetPass(passData.pass);
      }

      let currentPresident = "";

      presidentSnapshot.forEach((doc) => {
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
      <Box className="w-full bg-primary/30 flex flex-row items-center justify-between p-5">
        <p className="font-bold text-lg">AVHub</p>

        <Box className="flex flex-row gap-5 items-center">
          <p>Recursos</p>

          <Button
            className="flex gap-2 bg-sky-500 items-center justify-center"
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

          <Input>
            <InputField
              placeholder="Nombre del discursante"
              value={name}
              onChangeText={setName}
            />
          </Input>

          <Select onValueChange={setTalks}>
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

                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SelectItem
                    key={i}
                    label={`Discurso ${i}`}
                    value={`Discurso ${i}`}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>

          <Select onValueChange={setNum}>
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
                  <SelectItem key={index} label={i} value={i} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>

          <Button onPress={openGallery} disabled={loading}>
            <ButtonText>Subir imágenes</ButtonText>
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={() => handleFiles(Array.from(fileInputRef.current.files))}
          />

          {files.length > 0 && (
            <Box>
              <Heading size="md">Archivos seleccionados</Heading>

              {files.map((file, index) => (
                <p key={index}>📷 {file.name}</p>
              ))}
            </Box>
          )}

          <Button
            className="bg-sky-500"
            disabled={loading}
            onPress={sendDataResources}
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
