import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Box,
  Chip,
  Stack,
  CircularProgress
} from "@mui/material";
import DashboardLayout from "../../layout/DashboardLayout";

const API = "https://procurement-cm78.onrender.com";

const statusColor = (status) => {
  switch (status) {
    case "created":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/purchase-orders/`,   // ✅ Correct endpoint
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      console.log("PO Response:", res.data);
      setOrders(res.data);

    } catch (err) {
      console.log("PO Fetch Error:", err.response?.data);
      alert("Failed to load Purchase Orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Purchase Orders
      </Typography>

      <Paper sx={{ p: 4 }}>
        {loading ? (
          <CircularProgress />
        ) : orders.length === 0 ? (
          <Typography>No Purchase Orders Available</Typography>
        ) : (
          orders.map((order) => (
            <Box
              key={order.id}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 3,
                background: "#1e293b",
                color: "white"
              }}
            >
              <Stack spacing={1}>
                <Typography>
                  <strong>PO ID:</strong> {order.id}
                </Typography>

                <Typography>
                  <strong>Requisition ID:</strong> {order.requisition_id}
                </Typography>

                <Typography>
                  <strong>Vendor ID:</strong> {order.vendor_id}
                </Typography>

                <Typography>
                  <strong>Created At:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </Typography>

                <Chip
                  label={order.status.toUpperCase()}
                  color={statusColor(order.status)}
                />
              </Stack>
            </Box>
          ))
        )}
      </Paper>
    </DashboardLayout>
  );
};

export default PurchaseOrders;