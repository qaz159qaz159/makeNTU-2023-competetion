import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import PropTypes from "prop-types";
import { useMakeNTU } from "../../../hooks/useMakeNTU";

function SearchBar({ visibility, handleCheck, handleChange, searchMethod }) {
  const handleClick = (e) => {
    handleCheck(e.target.value);
  };
  const { breakpoints } = useMakeNTU();
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 6px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "68%",
        m: "1px",
        borderRadius: "10px",
        backgroundColor: "rgba(255,255,255,0.1)",
        visibility: { visibility } || 1,
      }}
    >
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={searchMethod}
          onChange={handleClick}
        >
          <FormControlLabel
            value="Name"
            control={<Radio />}
            label="by Name"
            sx={{
              display: breakpoints.isSm || breakpoints.isXs ? "none" : "block",
            }}
          />
          <FormControlLabel
            value="Tag"
            control={<Radio />}
            label="by Tag"
            sx={{
              display: breakpoints.isSm || breakpoints.isXs ? "none" : "block",
            }}
          />
        </RadioGroup>
      </FormControl>

      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={
          breakpoints.isSm || breakpoints.isXs ? "Search by name" : "Search"
        }
        onChange={(e) => {
          //   // console.log(e.target.value);
          handleChange(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        // inputProps={{ "aria-label": "search google maps" }}
      />

      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
SearchBar.propTypes = {
  handleChage: PropTypes.func.isRequired,
};
export default SearchBar;
