import { useState } from 'react';
import { useToast } from '../components/ToastContext';
import './Login.css';

export default function Login() {
    const [activeTab, setActiveTab] = useState('student'); // 'student' or 'admin'
    const { addToast } = useToast();

    const handleLogin = (e) => {
        e.preventDefault();
        addToast(`Successfully logged in as ${activeTab === 'student' ? 'Student' : 'Admin'}`, 'success');
    };

    return (
        <div className="section container animate-fade-in login-page">
            <div className="card login-card">
                <div className="login-header">
                    <img src="/logo.png" alt="SSPG BOYS" className="login-logo" />
                    <h1 className="heading-2">Welcome Back</h1>
                </div>

                <div className="login-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`}
                        onClick={() => setActiveTab('student')}
                    >
                        Student Login
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        Admin Login
                    </button>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="userId">
                            {activeTab === 'student' ? 'Student Registration No.' : 'Admin Username'}
                        </label>
                        <input type="text" id="userId" required placeholder={`Enter your ${activeTab === 'student' ? 'registration number' : 'username'}`} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" required placeholder="Enter your password" />
                    </div>
                    <div className="login-actions">
                        <a href="#" className="forgot-password">Forgot Password?</a>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block p-3 mt-4">
                        Login as {activeTab === 'student' ? 'Student' : 'Admin'}
                    </button>
                </form>
            </div>
        </div>
    );
}
