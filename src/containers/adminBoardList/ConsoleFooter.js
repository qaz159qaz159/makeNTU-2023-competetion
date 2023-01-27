import React from "react";
import styled from "styled-components";
import SearchBar from "../../components/searchBar";
import PropTypes from "prop-types";

const FooterContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  margin: auto;
  flex-direction: column;
  align-items: center;
`;
ConsoleFooter.propTypes = {
  setKeyWord: PropTypes.func.isRequired,
};
export default function ConsoleFooter({
  setKeyWord,
  searchMethod,
  handleCheck,
}) {
  return (
    <FooterContainer>
      <SearchBar
        handleCheck={handleCheck}
        handleChange={setKeyWord}
        searchMethod={searchMethod}
      />
    </FooterContainer>
  );
}
