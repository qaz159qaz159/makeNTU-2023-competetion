import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

import { useState } from "react";

// fake data
const groupNo = 1;
let status = 0; // default 0
let shown = true;
let leichieNo = "一"; //雷切一

// 預計完成時間
let doneTime = () => {
  if (status === 1) return "15 : 30"; // if使用中則回傳預估完成時間
  else return "-- : --"; // 未使用則沒有時間
};
// 機台使用狀態
const showStatus = (status) => {
  if (status == 0) return "○ 準備中";
  if (status == 1) return "● 運作中";
  return "X 暫停使用"; // debug
};

const cards = () => (
  <Grid item>
    {/* a card for a leichie made up by multi grids */}
    <Card sx={{ minHeight: 200, minWidth: 300 }} variant="outlined">
      <CardContent>
        {/* 機台使用資訊 */}
        <Grid
          container
          spacing={2}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item xs="auto">
            <Typography
              gutterBottom
              sx={{ fontSize: 20 }}
              color="text.secondary"
            >
              {/* 顯示運轉狀態 */}
              {showStatus(status)}
            </Typography>
            <Typography variant="h4" component="div">
              {`雷切${leichieNo}`}
            </Typography>
          </Grid>
        </Grid>

        {/* group and time info */}
        <Grid
          container
          spacing={2}
          marginTop={1}
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item>
            <Typography
              gutterBottom
              sx={{ fontSize: 16 }}
              color="text.secondary"
            >
              使用組別
            </Typography>
            <Typography sx={{ fontSize: 40 }} component="div">
              {`# ${groupNo}`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography sx={{ fontSize: 16 }} color="text.secondary">
              預計完成
            </Typography>
            <Typography sx={{ fontSize: 40 }} component="div">
              {doneTime()}
            </Typography>
          </Grid>
        </Grid>

        {/* 完成與移除按鈕 */}
        <Grid
          container
          marginTop={1}
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              sx={{ border: 1.5 }}
              variant="outlined"
              startIcon={<CheckIcon />}
              // todo: onclick -> 使用完成(狀態切換為 準備中)
            >
              使用完成
            </Button>

            <Button
              sx={{ border: 1.5 }}
              disabled={status === 1 ? true : false} // 需判斷若在使用中則不能按移除，必須先按使用完成才可以
              variant="outlined"
              startIcon={<DeleteIcon />}
              // todo: onclick -> 使用完成(暫停使用)
            >
              移除機台
            </Button>
          </Stack>
        </Grid>
      </CardContent>
    </Card>
  </Grid>
);

export default cards;
