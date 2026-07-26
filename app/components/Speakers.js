"use client";

import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

import { User, CalendarDays, Download } from "lucide-react";

function Speakers({ news }) {
 console.log(news[0], "newa")
  return (
    <Box className="rounded-lg overflow-hidden p-4">
      <Heading>Recursos de Discursantes</Heading>

      <Grid
        className="gap-4"
        _extra={{
          className: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-10",
        }}
      >
        {news.map((item) => (
          <Card key={item.id} className="p-5 rounded-lg">
            <div className="flex gap-3 items-center">
              <User color="#fa00b7" />
              <Text>{item.nombre}</Text>
            </div>

            <div className="mt-3">
              <Text>Bosquejo: {item.bosquejo}</Text>
            </div>

             <div className="mt-3">
              <Text>Alabanza: {item.alabanza.length > 20 ? item.alabanza.slice(0, 20).concat("...")  : item.alabanza }</Text>
            </div>

            <div className="flex gap-3 items-center mt-3">
              <CalendarDays />
              <Text>
                {item.fecha}
              </Text>
            </div>

            <Text className="mt-3">Recursos: {item.archivos?.length || 0}</Text>

            <div className="mt-4 flex flex-col gap-2">
              <Button
                onPress={() => {
                  window.open(`/api/download/${item.id}`, "_blank");
                }}
                className="bg-sky-600"
              >
                <Text>Descargar</Text>
              </Button>
            </div>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}

export default Speakers;
