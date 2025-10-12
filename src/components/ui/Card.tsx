import React from 'react';
import Box from './Box';

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <Box
      flexGrow={1}
      flex={1}
      borderRadius="m"
      position="relative"
      backgroundColor="white"
      overflow="hidden"
      justifyContent="space-between"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}>
      {children}
    </Box>
  );
}
