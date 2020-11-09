import React from "react";
import config from "../config/config.json";
import http from "../httpServices/services";
import Fontawesome from "react-fontawesome";

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

class Header extends React.Component {
  state = {
    members: [],
    payments: [],
    reciepts: [],
  };
  render() {
    const { members, payments, reciepts } = this.state;

    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0 bg-green">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Xubnaha
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {members.length}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <Fontawesome
                            className="fas fa-users"
                            name="users"
                            style={{ fontSize: 50 }}
                          />
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Lacag qabasho
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            $
                            {reciepts
                              .map((r) => r.amount)
                              .reduce(function (a, b) {
                                return a + b;
                              }, 0)}
                          </span>
                        </div>
                        <Fontawesome
                          className="fas fa-hand-holding-usd"
                          name="dollar"
                          style={{ fontSize: 50 }}
                        />
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Lacagta baxday
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            $
                            {payments
                              .map((p) => p.amount)
                              .reduce(function (a, b) {
                                return a + b;
                              }, 0)}
                          </span>
                        </div>
                        <Fontawesome
                          className="fas fa-hand-holding-usd"
                          name="dollar"
                          style={{ fontSize: 50 }}
                        />
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Userada
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">49</span>
                        </div>
                        <Col className="col-auto">
                          <Fontawesome
                            className="fas fa-user"
                            name="user"
                            style={{ fontSize: 50 }}
                          />
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </>
    );
  }
  async componentDidMount() {
    const { data: members } = await http.get(config.membersEndPoint);
    const { data: payments } = await http.get(config.paymentEndPoint);
    const { data: reciepts } = await http.get(config.recieptsEndPoint);

    this.setState({ members, payments, reciepts });
  }
}

export default Header;
