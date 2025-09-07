import React from "react";
import { Breadcrumb } from "react-bootstrap";
import "./breadcrumb.style.css";

export const PageBreadcrumb = ({ page }) => {
  return (
    <Breadcrumb className="custom-breadcrumb">
      <span className="breadcrumb-home">
        Home
      </span>
      <span className="breadcrumb-separator">/</span>
      <Breadcrumb.Item active className="breadcrumb-current">{page}</Breadcrumb.Item>
    </Breadcrumb>
  );
};
