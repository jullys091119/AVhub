
import Speakers from "../components/Speakers";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { VStack } from "@/components/ui/vstack";
async function adminPage() {
  const querySnapshotTalks = await getDocs(collection(db, "recursos"));
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
