import React, { useState, useEffect } from "react";
import {
    TextField,
    Box,
    Typography,
    Grid,
    Card,
    Button,
    CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const AllergenSelector = ({ onAllergenSelect, selectedAllergens = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [allergens, setAllergens] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchAllergens = async () => {
            try {
                const response = await axios.get('/api/v6/allergens?pageNumber=1&pageSize=999');
                setAllergens(response.data.items);
            } catch (error) {
                console.error("Error fetching allergens:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllergens();
    }, []);


    const filteredAllergens = allergens
        .filter(allergen => allergen.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    const isAllergenSelected = (allergenId) =>
        selectedAllergens.some(allergen => allergen.id === allergenId);

      const toggleAllergen = (allergen) => {
          if (!isAllergenSelected(allergen.id)) {
              const newAllergen = { id: allergen.id, name: allergen.name };
              onAllergenSelect([...selectedAllergens, newAllergen]);
          }
           else {
              onAllergenSelect(selectedAllergens.filter((selected) => selected.id !== allergen.id))
           }
    };

    return (
        <Box sx={{ width: "100%", margin: "0 auto" }}>
            <TextField
                variant="outlined"
                placeholder="Search Allergens"
                fullWidth
                InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                    },
                }}
            />

            <Box
                sx={{
                    overflowY: "auto",
                    maxHeight: "70vh",
                    border: "1px solid #ccc",
                    p: 1,
                    backgroundColor: "white",
                }}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                        <CircularProgress />
                    </Box>
                ) : filteredAllergens.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" textAlign="center">
                        No allergens found.
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {filteredAllergens.map((allergen) => (
                            <Grid item xs={12} sm={6} md={4} key={allergen.id}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "8px 16px",
                                        backgroundColor: isAllergenSelected(allergen.id) ? "#f5f5f5" : "#fff",
                                        opacity: isAllergenSelected(allergen.id) ? 0.6 : 1,
                                        borderColor: isAllergenSelected(allergen.id) ? "#555555" : "#000000",
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            textDecoration: isAllergenSelected(allergen.id) ? "line-through" : "none",
                                        }}
                                    >
                                        {allergen.name}
                                    </Typography>
                                    {!isAllergenSelected(allergen.id) && (
                                        <Button
                                            size="small"
                                            sx={{
                                                backgroundColor: "#6AA84F",
                                                color: "white",
                                                "&:hover": {
                                                    backgroundColor: "#A5E072",
                                                },
                                            }}
                                            onClick={() => toggleAllergen(allergen)}
                                        >
                                            Add
                                        </Button>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default AllergenSelector;