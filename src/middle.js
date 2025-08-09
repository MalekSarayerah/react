import axios from "axios";

import { Row } from 'react-bootstrap';
import Attend from './attend';

export default function Middle() {





    const handleAction = async (type) => {
        try {

            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not logged in.");
                return;
            }

            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            };


            const response = await axios.get("http://localhost:5085/api/Attendance", config);
            const today = new Date().toISOString().split("T")[0];
            const record = response.data.find(r => r.date === today);

            if (!record && type !== 1) {
                alert("You must Check-In first.");
                return;
            }

            if (type === 3 && !record.breakOut) {
                alert("You must Break-Out before Break-In.");
                return;
            }

            if (type === 4 && !record.breakIn) {
                alert("You must Break-In before Check-Out.");
                return;
            }


            const actionResponse = await axios.post("http://localhost:5085/api/Attendance", { type }, config);
            console.log("Success:", actionResponse.data);


            window.location.reload();

        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong while recording the attendance.");
        }
    };










    return (
        <>
            <Row className='pb-4'>
                <Attend name="Check-In" record="Records Check-In attendance in the database">
                    <button className="icon-btn" onClick={() => handleAction(1)}>
                        <i className="fas fa-check-circle"></i>
                    </button>
                </Attend>
                <Attend name="Break-Out" record="Records Break-Out attendance in the database">
                    <button className="icon-btn" onClick={() => handleAction(2)} >
                        <i className="fas fa-utensils"></i>
                    </button>
                </Attend>
                <Attend name="Break-In" record="Records Break-In attendance in the database">
                    <button className="icon-btn" onClick={() => handleAction(3)}>
                        <i className="fas fa-arrow-circle-left"></i>
                    </button>
                </Attend>
                <Attend name="Check-Out" record="Records Check-Out attendance in the database">
                    <button className="icon-btn" onClick={() => handleAction(4)}>
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </Attend>
            </Row>


        </>
    );
}
