import { Theme } from '@/src/theme/theme';
import { useTheme } from '@shopify/restyle';
import * as Clipboard from 'expo-clipboard';
import { CheckIcon, CopyIcon } from 'lucide-react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

export default function CopyButton({ id }: { id: string }) {
  const theme = useTheme<Theme>();
  const { primary } = theme.colors;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <TouchableOpacity onPress={copyToClipboard}>
      {copied ? <CheckIcon size={20} color={primary} /> : <CopyIcon size={20} color={primary} />}
    </TouchableOpacity>
  );
}
