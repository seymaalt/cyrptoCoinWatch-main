import { useState, useEffect } from "react";
import axios from "axios";
import { experimentalStyled as styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

function OverviewBox() {
  const [coinData1, setCoinData1] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/overview`,
        {
          currency: "USD",
        },
        {
          headers: {
            "content-type": "application/json",
            "x-api-key": apiKey,
          },
        }
      );

      setCoinData1([response]);
    } catch (error) {
      console.error("API isteği başarısız oldu", error);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div style={{ marginBottom: "10px" }}>
      <Grid container spacing={3}>
        <Grid item xs>
          <Item> <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>Piyasa Değeri</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coinData1.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {`$${row.data.cap.toLocaleString()}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer></Item>
        </Grid>
        <Grid item xs>
          <Item>  <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>Likidite</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coinData1.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {`$${row.data.liquidity.toLocaleString()}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer></Item>
        </Grid>
        <Grid item xs>
          <Item><TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>24 Saatlik Hacim</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coinData1.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {`$${row.data.volume.toLocaleString()}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer></Item>
        </Grid>
      </Grid>

    </div>
  );
}

export default OverviewBox;
