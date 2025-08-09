import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import hour from './hours';
import React, { useEffect, useState } from "react";

export default function Bottom() {
    const [data, setData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
    const user = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (user && token) {
        setIsLoggedIn(true);

        fetch("http://localhost:5085/api/Attendance", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => setData(data))
        .catch((error) => console.error("Error fetching data:", error));
    }
}, []);

    

    return (
        <div>
            <Row>
                <h1 className="display-2">Week Days </h1>
                <p className="fs-3" >List Attendancen Transactions</p>
                <hr />
                <Col sm={12}>
                {isLoggedIn?(
                    <Table responsive="sm" hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Check-in</th>
                                <th>Break-out</th>
                                <th>Break-in</th>
                                <th>Check-out</th>
                                <th>Hours</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((record, index) => (
                                <tr key={index}>
                                    <td>{new Date(record.date).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric"
                                    })}</td>
                                    <td>{record.checkIn}</td>
                                    <td>{record.breakOut}</td>
                                    <td>{record.breakIn}</td>
                                    <td>{record.checkOut}</td>
                                    <td>{hour(record)}</td>
                                    <td>{record.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ):(    <p className="fs-4 text-muted">Login to view attendance records.</p>
                )}
                </Col>
            </Row>
        </div>
    );
}
