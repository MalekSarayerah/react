

import Col from 'react-bootstrap/Col';
import "./App.css"
export default function Attend({ name, record ,children}){
    return (
    
            <Col sm className='text-center'>
            
            <h1 className=" display-5 text-primary "> {name}</h1>
            {children}
            <p className=" text-primary" id="records" >{record} </p>
            </Col>
            
        
    );
}