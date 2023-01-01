import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LaserCutterCards from "./admin_leichieCard";

const LaserCutterBox = ({
  laserCutterInfo,
  laserNumber,
  setLaserNumber,
  laserIdx,
  setLaserIdx,
}) => (
  <Card>
    <CardContent style={{ padding: 0 }}>
      {/* Grid container for all cards */}
      <Grid
        container
        wrap="nowrap"
        spacing={2}
        direction="row"
        style={{ padding: 10, overflow: "auto" }}
      >
        {/* 有幾台雷切就放幾個components */}
        {/* 是否要從資料庫叫回雷切的訊息？ 還是存在前端即可？*/}
        {/* {laserCutterInfo.some(cutter => cutter.id == )} */}
        {laserCutterInfo.map((c, i) => {
          if(!laserIdx.includes(parseInt(c.id))) return ; // skip 
          console.log("機台Id= "+i);
          return (
            <LaserCutterCards
              key={i}
              leichieId={c.id}
              leichieName={c.name}
              status={c.status}
              groupNo={c.usedBy}
              doneTime={c.completeTime}
              done={c.done}
              remove={c.remove}
              laserNumber={laserNumber}
              setLaserNumber={setLaserNumber}
              laserIdx={laserIdx}
              setLaserIdx={setLaserIdx}
            />
          );
        })}
      </Grid>
    </CardContent>
  </Card>
);

export default LaserCutterBox;
