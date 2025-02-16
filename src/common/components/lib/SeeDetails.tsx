import { useState } from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

interface SeeDetailsProps {
  details: Record<string, string | number>;
}

const SeeDetails = ({ details }: SeeDetailsProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box mt={2}>
      <Box
        display="flex"
        alignItems="center"
        onClick={() => setExpanded(!expanded)}
        sx={{ cursor: 'pointer' }}
      >
        <Typography variant="subtitle1" color="primary">
          {expanded ? 'Hide Details' : 'See Details'}
        </Typography>
        <IconButton size="small">
          {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box ml={2} mt={1}>
          {Object.entries(details).map(([key, value]) => (
            <Typography key={key} variant="body1" sx={{ display: 'flex', gap: 1 }}>
              <span style={{ fontWeight: 'bold', color: 'text.secondary' }}>{`${key}:`}</span>
              <span>{value}</span>
            </Typography>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default SeeDetails;
