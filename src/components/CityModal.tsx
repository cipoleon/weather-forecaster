import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchIcon from "@mui/icons-material/Search";
import {
  Modal,
  Box,
  Button,
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
import { skipToken, useQuery } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react";
import { getCities } from "../api/cityApi";
import { useDebounce } from "../hooks/useDebounce";
import type { CityItem } from "../types/city.types";

const MIN_SEARCH_LENGTH = 2;
const CITY_SEARCH_STALE_TIME = 5 * 60 * 1000;

const modalStyles = {
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
  canDismiss: boolean;
  onClose: () => void;
  onSelectCity: (city: CityItem) => void;
};

export default function CityModal({
  open,
  canDismiss,
  onClose,
  onSelectCity,
}: CityModalProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const canSearch = open && query.length >= MIN_SEARCH_LENGTH;
  const activeQuery = canSearch && query === debouncedQuery ? query : undefined;
  const {
    data: cities = [],
    isError,
    isPending,
    isFetching,
    errorUpdatedAt,
    refetch,
  } = useQuery({
    queryKey: ["city-search", activeQuery],
    queryFn: activeQuery
      ? ({ signal }) => getCities(activeQuery, signal)
      : skipToken,
    staleTime: CITY_SEARCH_STALE_TIME,
  });
  const isLoading = canSearch && (isPending || isFetching);
  const hasSearchError = isError || (isPending && errorUpdatedAt > 0);

  function handleClose() {
    if (!canDismiss) return;

    setQuery("");
    onClose();
  }

  function handleCityClick(city: CityItem) {
    setQuery("");
    onSelectCity(city);
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value.trim());
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box
          id="city-picker-dialog"
          sx={modalStyles}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          tabIndex={-1}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Város kiválasztása
          </Typography>
          <Typography id="modal-description">
            Keresd meg azt a települést, amelynek az előrejelzését szeretnéd
            látni.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            className="modal-search-input"
            label=""
            placeholder="Keress településre"
            variant="outlined"
            helperText="Kereséshez írj be legalább két karaktert."
            onChange={handleSearchChange}
            slotProps={{
              htmlInput: {
                "aria-label": "Település keresése",
                "aria-busy": isLoading,
              },
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
                    {isLoading && (
                      <CircularProgress
                        size={20}
                        thickness={4}
                        disableShrink
                        aria-label="Városok keresése"
                      />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
          {cities.length > 0 && (
            <List id="modal-city-list" aria-label="Keresési találatok">
              {cities.map((city) => (
                <ListItem
                  disablePadding
                  key={city.id ?? `${city.name}:${city.latitude},${city.longitude}`}
                >
                  <ListItemButton onClick={() => handleCityClick(city)}>
                    <ListItemText
                      primary={city.name}
                      secondary={
                        (city.name === city.county ? "" : `${city.county}, `) +
                        city.country
                      }
                    />
                    <ArrowForwardIosIcon fontSize="small" />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          {activeQuery && hasSearchError && (
            <Box
              role="alert"
              sx={{ mt: 2, textAlign: "center", color: "var(--text-modal)" }}
            >
              <Typography component="p">
                Nem sikerült lekérni a városokat.
              </Typography>
              <Button
                type="button"
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                disabled={isFetching}
                onClick={() => void refetch()}
              >
                Újrapróbálás
              </Button>
            </Box>
          )}
          {activeQuery &&
            !isPending &&
            !isFetching &&
            !isError &&
            cities.length === 0 && (
              <Typography
                id="modal-no-city"
                variant="body1"
                component="p"
                role="status"
              >
                Nincs találat
              </Typography>
            )}
        </Box>
      </Fade>
    </Modal>
  );
}
