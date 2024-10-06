import React, { useState } from 'react';
import { View, Alert, TextInput, Text } from 'react-native';
import { SafeAreaView } from '@/components/safe-area-view';
import { Button } from '@/components/ui/button';

import { H1, Muted } from '@/components/ui/typography';
import { supabase } from '@/config/supabase';

const MagicLinkScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async () => {
    if (!email) return Alert.alert('Please enter your email address');
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'com.supabase://auth/callback',
      },
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Check your email', 'We sent you a magic link to sign in');
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="flex-1 justify-center gap-y-4">
        <H1 className="text-center">Sign in with Magic Link</H1>
        <Muted className="text-center">
          Enter your email address to receive a magic link for signing in.
        </Muted>
        <TextInput
          className="w-full p-2 border border-border rounded-md"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button
          className="w-full rounded-xl"
          size="lg"
          onPress={handleMagicLink}
          disabled={loading}>
          <Text>{loading ? 'Sending...' : 'Send Magic Link'}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default MagicLinkScreen;
