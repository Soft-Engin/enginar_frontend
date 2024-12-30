import * as React from "react";
import {
  Typography,
  Box,
  Avatar,
  ImageList,
  ImageListItem,
  CircularProgress,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";
import { format, parseISO, formatDistanceToNow } from "date-fns";

export default function Comment({ comment, commentImage }) {
  const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [errorProfile, setErrorProfile] = React.useState(null);
  const [commentImages, setCommentImages] = React.useState([]);
  const [loadingImages, setLoadingImages] = React.useState(true);
  const [errorImages, setErrorImages] = React.useState(null);

  React.useEffect(() => {
    if (comment && comment.userId) {
      const fetchProfilePicture = async () => {
        setLoadingProfile(true);
        setErrorProfile(null);
        try {
          const response = await axios.get(
            `/api/v1/users/${comment.userId}/profile-picture`,
            { responseType: "blob" }
          );
          if (response.data) {
            const profileUrl = URL.createObjectURL(response.data);
            setProfilePictureUrl(profileUrl);
          } else {
            setProfilePictureUrl(null);
          }
        } catch (err) {
          console.error("Error fetching profile picture:", err);
          setErrorProfile(err.message || "An unexpected error occurred.");
        } finally {
          setLoadingProfile(false);
        }
      };
      fetchProfilePicture();
    }
    return () => {
      if (profilePictureUrl) {
        URL.revokeObjectURL(profilePictureUrl);
      }
    };
  }, [comment]);
  React.useEffect(() => {
    if (comment && comment.id) {
      const fetchCommentImages = async () => {
        setLoadingImages(true);
        setErrorImages(null);
        const images = [];
        for (let i = 0; i < comment.imagesCount; i++) {
          try {
            const response = await axios.get(
              `/api/v1/comments/${comment.id}/images/${i}`,
              { responseType: "blob" }
            );
            if (response.data) {
              const imageUrl = URL.createObjectURL(response.data);
              images.push(imageUrl);
            }
          } catch (error) {
            console.error(
              `Error fetching image for comment ${comment.id} at index ${i}:`,
              error
            );
          }
        }
        setCommentImages(images);
        setLoadingImages(false);
      };
      fetchCommentImages();
    }
    return () => {
      for (const imageUrl of commentImages) {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      }
    };
  }, [comment]);

  return (
    <Box sx={{ maxWidth: 1500, width:1500, backgroundColor: "#EAEAEA", pb: 1.3, pt: 2.2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", pb: 1.2 }}>
          <Avatar
            src={profilePictureUrl}
            sx={{ width: 50, height: 50, mr: 1.3 }}
            onError={() => setProfilePictureUrl(null)}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" fontWeight="bold" noWrap>
              {comment.userName}
            </Typography>
            <Typography variant="body2">{comment.text}</Typography>
            {errorProfile && (
              <Box display="flex" justifyContent="center" my={2}>
                <Typography color="error">Error: {errorProfile}</Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary">
              {comment.timestamp &&
                formatDistanceToNow(parseISO(comment.timestamp), {
                  addSuffix: true,
                })}
            </Typography>
            {loadingImages ? (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress size={20} />
              </Box>
            ) : commentImages && commentImages.length > 0 ? (
              <ImageList cols={3} gap={8} sx={{ mt: 1, width: "400px" }}>
                {commentImages.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`Comment image ${index}`}
                      style={{
                        width: "100%",
                        height: "100px",
                        display: "block",
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid #C0C0C0",
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ) : null}
            {errorImages && (
              <Box display="flex" justifyContent="center" my={2}>
                <Typography color="error">Error: {errorImages}</Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", ml: 4 }}>
          <MoreHorizIcon sx={{ fontSize: "30px" }} />
        </Box>
      </Box>
    </Box>
  );
}
