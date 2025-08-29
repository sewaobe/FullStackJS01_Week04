import { useState } from "react";
import { sendOtpApi, verifyOtpApi } from "../util/app";
import { Form, Input, Button, Card, Typography, notification } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sendOtpApi(email);
      if (res.status === 200) {
        notification.success({
          message: "Success",
          description: res.msg,
        });
        setStep(2);
      } else {
        notification.error({
          message: "Error",
          description: res.msg || "Failed to send OTP",
        });
      }
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.msg || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtpApi(email, otp, newPassword);
      if (res.status === 200) {
        notification.success({
          message: "Success",
          description: res.msg,
        });
        navigate('/login')
      } else {
        notification.error({
          message: "Error",
          description: res.msg || "Invalid OTP or password reset failed",
        });
      }
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.msg || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#f5f5f5"}}>
      <Card style={{width:400,padding:20,borderRadius:8,boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}>
        {step === 1 ? (
          <>
            <Title level={3} style={{ textAlign: "center" }}>Forgot Password</Title>
            <Form layout="vertical" onSubmitCapture={sendOtp}>
              <Form.Item label="Email" required>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Send OTP
              </Button>
            </Form>
          </>
        ) : (
          <>
            <Title level={3} style={{ textAlign: "center" }}>Reset Password</Title>
            <Form layout="vertical" onSubmitCapture={verifyOtp}>
              <Form.Item label="OTP" required>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
              </Form.Item>
              <Form.Item label="New Password" required>
                <Input.Password
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Confirm Reset
              </Button>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
}
