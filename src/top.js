import './App.css';
import Row from 'react-bootstrap/Row';
import Reg from './reg';
import { useEffect, useState } from 'react';

export default function Top() {
    const d = new Date().toLocaleString();
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const [username, setUsername] = useState("GUEST");

    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        if (storedUser) {
            setUsername(storedUser);
        }
    }, []);

    return (
        <Row className="rounded-bottom mb-5 px-4 " id="topdiv">
            <h1 className="display-1 pb-4 " id="dwt"> DWT Attendance</h1>
            <h4 className="topp pb-4  ">Welcome {username}</h4>
            <h4 className="pb-4 " id="topdate">{d} </h4>
            <div className="pb-4 clearfix">
                <h3>
                    {username === "GUEST" ? (

                        <span
                            className="float-end text-primary"
                            onClick={handleShow}
                            style={{ cursor: 'pointer' }}
                        >
                            Login / Register
                        </span>
                    ) : (

                        <span
                            className="float-end text-primary"
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('username');
                                window.location.reload();
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            LOGOUT
                        </span>
                    )}
                </h3>
            </div>

            <Reg show={showModal} handleClose={handleClose} />
        </Row>
    );

}