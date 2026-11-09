import {
  Modal,
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Fade,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { getCities } from "../api/cityApi";
import { useDebounce } from "../hooks/useDebounce";
import type { CityItem } from "../types/city.types";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const style = {
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translateX(-50%)",
  width: "80%",
  maxWidth: 400,
  bgcolor: "background.paper",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 40px 80px -30px rgba(0, 0, 0, 0.7);",
  p: 4,
  borderRadius: "16px",

  "& #modal-title": {
    fontWeight: "bold",
    color: "var(--text-modal)",
  },
  "& #modal-description, & .modal-search-input": {
    mt: 2,
    color: "var(--text-modal)",
  },
  "& .modal-search-input": {
    borderRadius: "16px",
  },
  "& #modal-city-list": {
    maxHeight: 350,
    overflow: "auto",
    color: "var(--text-modal)",
  },
  "& #modal-no-city": {
    pt: 4,
    pb: 2,
    textAlign: "center",
    color: "var(--text-modal)",
  },
};

type CityModalProps = {
  open: boolean;
  city: CityItem | undefined;
  // TODO Az id-k csekkolása, és a var nevek
  setOpen: (open: boolean) => void;
  setCity: (city: CityItem) => void;
};

export default function CityModal({
  city,
  open,
  setOpen,
  setCity,
}: CityModalProps) {
  const handleClose = () => {
    if (city) {
      closeModal();
    }
  };

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canShowNotFoundOrError, setCanShowNotFoundOrError] = useState(false);
  const [error, setError] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 600);

  const [cities, setCities] = useState<CityItem[]>([]);

  const visibleCities = debouncedSearch.length >= 2 ? cities : [];

  const handleOnCityClick = (cityItem: CityItem) => {
    localStorage.setItem("city", JSON.stringify(cityItem));
    setCity(cityItem);
    closeModal();
  };

  const handleOnSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => {
    const searchValue = event.target.value;
    setSearch(searchValue);
    setError("");
    setIsLoading(true);
    if (!searchValue) setCanShowNotFoundOrError(false);
  };

  const closeModal = () => {
    setSearch("");
    setError("");
    setCanShowNotFoundOrError(false);
    setCities([]);
    setIsLoading(false);
    setOpen(false);
  };

  useEffect(() => {
    async function getData() {
      await getCities(debouncedSearch)
        .then((cities) => {
          setError("");
          setCities(cities);
        })
        .catch(() => {
          setError("Nem sikerült lekérni a városokat.");
          setCities([]);
        })
        .finally(() => {
          setCanShowNotFoundOrError(true);
          setIsLoading(false);
        });
    }

    if (debouncedSearch.length >= 2) {
      getData();
    }
  }, [debouncedSearch]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Város kiválasztása
          </Typography>
          <Typography id="modal-description">
            Keresd meg azt a települést, amelynek az előrejelzését szeretnéd
            látni.
          </Typography>
          <TextField
            fullWidth
            className="modal-search-input"
            label=""
            placeholder="Keress településre"
            variant="outlined"
            helperText="Kereséshez írj be legalább két karaktert."
            onChange={handleOnSearchChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{
                      width: 32,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {isLoading && search.length >= 2 && (
                      <CircularProgress size={20} thickness={4} disableShrink />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
          {!!visibleCities.length && !isLoading && (
            <List id="modal-city-list">
              {visibleCities.map((visibleCity, index) => {
                return (
                  <ListItem disablePadding key={index}>
                    <ListItemButton
                      onClick={() => handleOnCityClick(visibleCity)}
                    >
                      <ListItemText
                        primary={visibleCity.name}
                        secondary={
                          (visibleCity.name === visibleCity.county
                            ? ""
                            : visibleCity.county + ", ") + visibleCity.country
                        }
                      />
                      <ArrowForwardIosIcon fontSize="small" />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}

          {!visibleCities.length &&
            search.length >= 2 &&
            canShowNotFoundOrError &&
            !isLoading && (
              <Typography id="modal-no-city" variant="body1" component="p">
                {error ? error : "Nincs Találat"}
              </Typography>
            )}
        </Box>
      </Fade>
    </Modal>
  );
}
