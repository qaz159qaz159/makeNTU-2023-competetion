import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";

import Box from "@mui/material/Box";
import { useMakeNTU } from "../../../hooks/useMakeNTU";
const GroupStatusContent = (props) => {
  const { data, open } = props;
  const { updateReq, deleteRequestFromUser } = useMakeNTU();
  const handleAsk = () => {
    if (!data?._id) {
      // console.log("missing requestID: ", data?._id);
      return;
    }
    updateReq({ requestID: data?._id, requestStatus: "ready" });
  };
  const handleDenied = () => {
    if (!data?._id) {
      // console.log("missing requestID: ", data?._id);
      return;
    }
    updateReq({ requestID: data?._id, requestStatus: "denied" });
  };
  const handleCancel = () => {
    if (!data?._id) {
      // console.log("missing requestID: ", data?._id);
      return;
    }
    updateReq({ requestID: data?._id, requestStatus: "cancel" });
  };
  const handleTook = () => {
    if (!data?._id) {
      // console.log("missing requestID: ", data?._id);
      return;
    }
    updateReq({ requestID: data?._id, requestStatus: "solved" });
    deleteRequestFromUser([data.borrower.teamID, data?._id]);
  };
  return (
    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1 }}>
          <Table size="small" sx={{ m: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell>Items</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.requestBody?.map((detail) => (
                <TableRow key={`${data?._id}${detail?.board}`}>
                  <TableCell component="th" scope="row">
                    {detail?.board}
                  </TableCell>
                  <TableCell>{detail?.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ margin: 1, display: "flex", flexDirection: "row-reverse" }}>
          {data?.status === "pending" ? (
            <>
              <Chip
                label="呼叫"
                variant="outlined"
                onClick={handleAsk}
                sx={{ ml: 1 }}
              />
              <Chip
                label="拒絕"
                variant="outlined"
                onClick={handleDenied}
                sx={{ ml: 1 }}
              />
            </>
          ) : data?.status === "ready" ? (
            <>
              <Chip
                label="已領取"
                variant="outlined"
                onClick={handleTook}
                sx={{ ml: 1 }}
              />
              <Chip
                label="取消"
                variant="outlined"
                onClick={handleCancel}
                sx={{ ml: 1 }}
              />
            </>
          ) : (
            <></>
          )}
        </Box>
      </Collapse>
    </TableCell>
  );
};

export default GroupStatusContent;
