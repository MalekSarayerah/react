import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';  

export default function Reg({ show, handleClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const url = isLogin
                ? 'http://localhost:5085/api/Auth/login'
                : 'http://localhost:5085/api/Auth/register';

            const data = { email, password };
            if (!isLogin) data.name = name;

            const response = await axios.post(url, data);

            if (isLogin) {
                const token = response.data.token;
                localStorage.setItem('token', token);

                const payload = JSON.parse(atob(token.split('.')[1]));
                const username = payload.unique_name || payload.name || email;
                localStorage.setItem('username', username);


                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setName('');

                handleClose();
                window.location.reload();
            } else {
                alert('Registration successful! Please log in.');


                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setName('');

                setIsLogin(true);
            }
        } catch (err) {
            const data = err.response?.data;
            if (Array.isArray(data)) {
                setError(data.map(e => e.description).join("\n"));
            } else if (typeof data === 'string') {
                setError(data);
            } else {
                setError("An error occurred.");
            }
        }
    };


    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isLogin ? 'Login' : 'Register'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className="text-danger">{error}</p>}
                <Form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete='nope'
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required

                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            autoComplete='nope'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required

                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            autoComplete='new-password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required

                        />
                    </Form.Group>

                    {!isLogin && (
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                autoComplete='new-password'
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required

                            />
                        </Form.Group>
                    )}

                    <Button type="submit" className="w-100   primary">
                        {isLogin ? 'Login' : 'Register'}
                    </Button>
                </Form>

                <div className="mt-3 text-center">
                    <Button variant="link" onClick={toggleMode}>
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </Button>
                </div>
            </Modal.Body>

        </Modal>
    );
}
