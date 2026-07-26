
import { HStack } from "@/components/ui/hstack";
import Speakers from "../components/Speakers";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { VStack } from "@/components/ui/vstack";
import Login from  "./../components/Login"

async function adminPage() {
  const querySnapshot = await getDocs(collection(db, "password"));
  const querySnapshotTalks = await getDocs(collection(db, "recursos"));

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    /*  console.log(doc.id, " => ", doc.data()); */
  });

  let news = [];

  querySnapshotTalks.forEach((doc) => {
    const data = doc.data();
    news.push({
      id: doc.id,
      nombre: data.nombre,
      bosquejo: data.bosquejos,
      archivos: data.archivos,
      fecha: data.fecha?.toDate().toLocaleDateString(),
      alabanza: data.alabanza
    });
  });


  return (
    <VStack className="items-center">
      <Speakers news={news} />
    </VStack>
  );
}

export default adminPage;
