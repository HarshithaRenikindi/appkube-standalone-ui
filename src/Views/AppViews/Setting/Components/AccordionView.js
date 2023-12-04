import React, { Component, Fragment } from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { v4 } from "uuid";
class AccordionView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      headers: this.props.headers || "",
      selectedNodes: [],
    };
  }

  renderTableHead = () => {
    let { headers } = this.state;
    if (headers?.length) {
      return (
        <TableRow>
          {headers.map((header) => (
            <TableCell key={v4()} style={header.styled}>
              {header.name}
            </TableCell>
          ))}
        </TableRow>
      );
    }
  };

  /**
   * Render the table  view
   *  @param {Array} data - child data as array of object
   *  @param {String} parentIndex - parent index
   */
  renderTableBody = (data, parentIndex) => {
    let { selectedNodes } = this.state;
    return data.map((subchild, childIndex) => {
      let currentNode = `${parentIndex ? `${parentIndex}_` : ""}${childIndex}`;
      let isActive = selectedNodes.includes(currentNode);
      let arrowDownOrRight = isActive ? "down" : "right";
      let childDataShow =
        selectedNodes.includes(currentNode) && subchild?.chlidren?.length;
      return (
        <Fragment key={v4()}>
          <TableRow className={`${isActive ? "active" : ""}`}>
            <TableCell
            
              width={80}
              onClick={(e) => {
                e.stopPropagation();
                this.onClickNode(currentNode);
              }}
              className="accrodion-main-title"
            >
              <i className={`fas fa-chevron-${arrowDownOrRight}`}></i>
              {subchild.name}
            </TableCell>
            {subchild.subName ? (
              <TableCell width={120}>
                {subchild.subName ? subchild.subName : <></>}
              </TableCell>
            ) : (
              <></>
            )}
          </TableRow>
          {childDataShow ? (
            this.renderTableBody(subchild?.chlidren, currentNode)
          ) : (
            <></>
          )}
        </Fragment>
      );
    });
  };

  /**
   * Fire click event on node
   *  @param {String} currentNode - selected index
   */
  onClickNode = (currentNode) => {
    let { selectedNodes } = this.state;
    let isExistNode = selectedNodes.filter((policy) => policy === currentNode);

    if (isExistNode.length) {
      selectedNodes = selectedNodes.filter((policy) => policy !== currentNode);
    } else {
      selectedNodes.push(currentNode);
    }
    this.setState({ selectedNodes });
  };

  render() {
    let { data } = this.state;
    return data?.length ? (
      <TableContainer component={Paper} className="access-control-table">
        <Table aria-label="collapsible table" className="table">
          <TableHead>{this.renderTableHead()}</TableHead>
          <TableBody> {this.renderTableBody(data)}</TableBody>
        </Table>
      </TableContainer>
    ) : (
      <></>
    );
  }
}

export default AccordionView;
