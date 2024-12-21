import * as React from "react";
import {
  Box,
  Typography,
  Avatar
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ShareIcon from "@mui/icons-material/Share";
import axios from "axios";

export default function BlogDetailed({blogId}) {
    

    const [blogData, setBlogData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      const fetchBlog = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(`http://localhost:8090/api/v1/blog/${blogId}`);
          setBlogData(response.data);
        } catch (err) {
          setError(err.message || "Failed to fetch blog data");
        } finally {
          setLoading(false);
        }
      }

      fetchBlog();
    }, [blogId]);

    if (loading) {
      return <Typography>Loading blog data...</Typography>;
    }
  
    if (error) {
      return <Typography color="error">Error: {error}</Typography>;
    }
  
    if (!blogData) {
      return <Typography>No blog data available.</Typography>;
    }

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: 'numeric',
        minute: '2-digit'
    })

  return(
    <Box sx={{ maxWidth: 1500, outline: "1.5px solid #C0C0C0", backgroundColor: "#FFFFFF", pl: 4, pr: 4, pt: 2, pb: 1, borderRadius: "20px 20px 0 0", boxShadow: 3 }} >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1.2, mb: 1.2, borderBottom: "1px solid #E0E0E0" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Placeholder avatar */}
          <Avatar sx={{ width: 50, height: 50, marginRight: 1.5 }} /> 
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ marginRight: 0.5 }} noWrap>
               User ID: {blogData.userId}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              5 days ago {/* Placeholder date */}
            </Typography>
          </Box>
        </Box>
        <MoreHorizIcon sx={{ fontSize: '40px' }} />
      </Box>
      
      <Typography variant="body1" component="div" sx={{ lineHeight: "28px", mb: 2 }}>
        {blogData.bodyText}
      </Typography>

      <img src="https://via.placeholder.com/400x225" alt="Enginar Yemeği" style={{ width: "100%", height: "450px", display: "block", objectFit: "cover", borderRadius: 10, border: "1px solid #C0C0C0" }} />

      <Box sx={{ display: "flex", alignItems: "center", pb: 1, mb: 1, mt: 1.5, borderBottom: "1px solid #C0C0C0" }}>
        <Typography variant="body1" color="text.secondary" sx={{ marginRight: 0.5 }} noWrap>
          {formattedTime}
        </Typography>
        <Typography variant="body1" color="text.secondary" noWrap>
          · {formattedDate}
        </Typography>
      </Box>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FavoriteBorderIcon style={{ fontSize: "45px", marginRight: 4 }} />
            <Typography variant="body1" color="text.secondary">
              39,500
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ChatBubbleOutlineIcon style={{ fontSize: "42px", marginRight: 4 }} />
            <Typography variant="body1" color="text.secondary">
              14
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ShareIcon style={{ fontSize: "42px", marginRight: 6 }} />
          <BookmarkBorderOutlinedIcon style={{ fontSize: "48px" }} />
        </Box>
      </Box>
    </Box>
  )
}