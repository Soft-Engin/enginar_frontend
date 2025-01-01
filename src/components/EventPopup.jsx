import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from 'react-router-dom';

export default function EventPopup(props) {
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [requirementOptions, setRequirementOptions] = useState([]);
  const [locationData, setLocationData] = useState({
    countries: [],
    cities: [],
    districts: [],
  });

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [requirementPage, setRequirementPage] = useState(1); // Track current page
  const [totalRequirements, setTotalRequirements] = useState(0); // Total count of requirements
  const [loadingRequirements, setLoadingRequirements] = useState(false);


  useEffect(() => {
    const fetchRequirements = async () => {
      setLoadingRequirements(true);
      try {
        const response = await axios.get(`/api/v1/events/requirements?pageNumber=${requirementPage}&pageSize=15`);
        if (response.data && response.data.items) {
          setRequirementOptions(response.data.items);
          setTotalRequirements(response.data.totalCount);
        }
        else {
          setError("Could not load requirements");
          console.error("Error, requirements response is not in the correct format", response.data)
        }

      } catch (err) {
        setError("Error loading requirements")
        console.error("Error fetching requirements:", err);
      }
      finally {
        setLoadingRequirements(false);
      }
    };
    fetchRequirements();
  }, [requirementPage]);

  useEffect(() => {
    const fetchAllLocationData = async () => {
      try {
        const countriesResponse = await axios.get("/api/v1/events/countries");
        const countries = countriesResponse.data;

        const citiesPromises = countries.map((country) =>
          axios
            .get(`/api/v1/events/countries/${country.id}/cities`)
            .then((response) =>
              response.data.map((city) => ({
                ...city,
                countryId: country.id,
              }))
            )
        );
        const citiesArrays = await Promise.all(citiesPromises);
        const cities = citiesArrays.flat();

        const districtsPromises = cities.map((city) =>
          axios
            .get(`/api/v1/events/cities/${city.id}/districts`)
            .then((response) =>
              response.data.map((district) => ({
                ...district,
                cityId: city.id,
              }))
            )
        );
        const districtsArrays = await Promise.all(districtsPromises);
        const districts = districtsArrays.flat();

        setLocationData({
          countries,
          cities,
          districts,
        });
      } catch (err) {
        console.error("Error fetching location data:", err);
        setError(err.message || "Error loading location data");
      }
    };
    fetchAllLocationData();
  }, []);

  const handleClose = () => {
    props.handleClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCountry) {
      setError("Please select a country.");
      return;
    }

    const eventData = {
      title: eventName,
      bodyText: eventDescription,
      date: new Date(eventDate).toISOString(),
      districtId: selectedDistrict || 0,
      addressName: "TODO address name for now",
      street: address,
      requirementIds: selectedRequirements,
    };

    console.log(eventData)
    try {
      const response = await axios.post(`/api/v1/events`, eventData);
      if (response.data && response.data.eventId) {
        navigate(`/event/?id=${response.data.eventId}`);
        handleClose();
      } else {
        setError("Event created successfully, but could not get the event id");
        console.error("Error, event id not in the response")
      }
    } catch (err) {
      setError("Error creating the event");
      console.error("Error creating event:", err);
    }
  };


  const handleRequirementsChange = (event) => {
    const { value } = event.target;
    setSelectedRequirements(typeof value === "string" ? value.split(",").map(Number) : value);
  };


  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedCity("");
    setSelectedDistrict("");
    setAddress("");

  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setSelectedDistrict("");
    setAddress("");

  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setAddress("");
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleEventDateChange = (event) => {
    setEventDate(event.target.value);
  };

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
  };
  const handleEventDescriptionChange = (event) => {
    setEventDescription(event.target.value);
  };
  const handleLoadMoreRequirements = () => {
    if (requirementOptions.length < totalRequirements) {
      setRequirementPage(requirementPage + 1);
    }
  };
  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      maxWidth={"md"}
      PaperProps={{
        sx: {
          width: { xs: 250, sm: 400, md: 550, lg: 600, xl: 620 },
          borderRadius: 4,
          backgroundColor: "#C8EFA5",
          padding: 0.5,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            color: "#333",
            fontSize: "1.5rem",
          }}
        >
          Create New Event
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#555",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            name="eventName"
            autoFocus
            fullWidth
            required
            label="Event Name"
            variant="outlined"
            value={eventName}
            onChange={handleEventNameChange}
            sx={{
              marginBottom: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              mt: 1,
            }}
          />
          <Box
            display="flex"
            gap={2}
            sx={{
              marginBottom: 2,
            }}
          >
            <TextField
              name="eventDate"
              type="date"
              fullWidth
              required
              label="Event Date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              value={eventDate}
              onChange={handleEventDateChange}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
              }}
            />
          </Box>
          <Box display="flex" gap={2} sx={{ marginBottom: 2 }}>
            <FormControl fullWidth>
              <Select
                labelId="country-select-label"
                id="country-select"
                value={selectedCountry}
                onChange={handleCountryChange}
                required
                renderValue={(value) => value ? locationData.countries.find(country => country.id === value)?.name : "Country"}
                displayEmpty
              >
                {locationData.countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="city-select-label">City</InputLabel>
              <Select
                labelId="city-select-label"
                id="city-select"
                value={selectedCity}
                label="City"
                onChange={handleCityChange}
                disabled={!selectedCountry}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {locationData.cities
                  .filter((city) => city.countryId === selectedCountry)
                  .map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="district-select-label">District</InputLabel>
              <Select
                labelId="district-select-label"
                id="district-select"
                value={selectedDistrict}
                label="District"
                onChange={handleDistrictChange}
                disabled={!selectedCity}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {locationData.districts
                  .filter((district) => district.cityId === selectedCity)
                  .map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
          {selectedDistrict && (
            <TextField
              name="address"
              fullWidth
              label="Address"
              variant="outlined"
              value={address}
              onChange={handleAddressChange}
              sx={{
                marginBottom: 2,
                backgroundColor: "#fff",
                borderRadius: 2,
              }}
            />
          )}
          {/* End Location Selection */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="requirements-select-label">
              Requirements
            </InputLabel>
            <Select
              labelId="requirements-select-label"
              id="requirements-select"
              multiple
              value={selectedRequirements}
              onChange={handleRequirementsChange}
              label="Requirements"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const option = requirementOptions.find(
                      (item) => item.id === value
                    );
                    return option ? (
                      <Chip key={value} label={option.name} />
                    ) : null;
                  })}
                </Box>
              )}
            >
              {requirementOptions.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="description"
            fullWidth
            multiline
            rows={4}
            label="Event Description"
            variant="outlined"
            value={eventDescription}
            onChange={handleEventDescriptionChange}
            sx={{
              marginBottom: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#4B9023",
              color: "#fff",
              ":hover": {
                backgroundColor: "#4B9023",
              },
              borderRadius: 20,
              marginTop: 2,
              display: "block",
              marginLeft: "auto",
            }}
          >
            Create Event
          </Button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </DialogContent>
      </form>
    </Dialog>
  );
}