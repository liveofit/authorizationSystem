import "./style.css";

import React from "react";
import "@patternfly/react-styles";

import {
  ToolbarItem,
  Toolbar,
  ToolbarContent,
  Pagination,
  PerPageOptions
} from "@patternfly/react-core";


interface ToolbarProps {
  totalRecords: number;
  pageLimit: number;
  currentPage: number;
  posibleLimitsPerPage: number[];
  onPageLimitChanged: (newLimit: number) => void;
  onPageChanged: (newPage: number) => void;
}

export const FooterToolbar: React.FC<ToolbarProps> = (props) => {
  const { posibleLimitsPerPage, pageLimit, onPageLimitChanged, currentPage, totalRecords, onPageChanged } = props;
  return (

      <Toolbar className="--footer-toolbar">
          <ToolbarContent>
              <ToolbarItem variant="pagination" alignment={{ default: 'alignRight' }}>
                <Pagination
                  dropDirection="up"
                  perPageOptions={posibleLimitsPerPage.map(p => ({ title: p.toString(), value: p} as PerPageOptions))}
                  itemCount={totalRecords}
                  perPage={pageLimit}
                  page={currentPage}
                  onSetPage={(e, v) => onPageChanged(v)}
                  widgetId="pagination-options-menu-top"
                  onPerPageSelect={(e, v) => onPageLimitChanged(v)}

                />
              </ToolbarItem>
          </ToolbarContent>
    </Toolbar>
  );
};
