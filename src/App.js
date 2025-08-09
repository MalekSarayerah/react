import './App.css';
import Top from './top'
import Middle from "./middle";
import Bottom from './bottom';

import { Container } from 'react-bootstrap';


function App() {

    return (

        <Container>

            <Top />

            <Middle />
            <Bottom />

        </Container>
    );
}

export default App;
