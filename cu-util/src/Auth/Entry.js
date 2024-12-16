import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";

const Entry = ({client_id, redirect_uri}) => (
    <Container fluid>
        <Col>
             <Button
                variant="dark"
                onClick={() => {
                window.location.href = `https://app.clickup.com/api?client_id=${client_id}&redirect_uri=${redirect_uri}`;
                }}>
                Connect
            </Button>
        </Col>
    </Container>
)

const EntryContainer = () => {

    const client_id = process.env.REACT_APP_CLIENT_ID;
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI;

    return <Entry client_id={client_id} redirect_uri={redirect_uri}/>;
};

export default EntryContainer;