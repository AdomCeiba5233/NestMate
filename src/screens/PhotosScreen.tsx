import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AppButton from '../components/AppButton';
import AsyncBoundary from '../components/AsyncBoundary';
import ElevatedCard from '../components/ElevatedCard';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchProfile, getMaxPhotos, updateProfile } from '../services/profileService';

type Props = NativeStackScreenProps<RootStackParamList, 'Photos'>;

const PLACEHOLDER_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  avatar: 'person',
  books: 'library',
};

const TIPS = [
  'A clear face photo builds the most trust',
  'Add one photo of a hobby or your study setup',
  'Tap and hold to reorder — first photo is your main',
];

export default function PhotosScreen({ navigation }: Props) {
  const { data: profile, loading, error, reload } = useAsyncData(fetchProfile, []);
  const maxPhotos = getMaxPhotos();
  const [photos, setPhotos] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setPhotos(profile.photos ?? []);
    }
  }, [profile]);

  async function persist(next: string[]) {
    setPhotos(next);
    setSaving(true);
    await updateProfile({ photos: next });
    setSaving(false);
  }

  async function handleAddPhoto() {
    if (photos.length >= maxPhotos) {
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      await persist([...photos, result.assets[0].uri]);
    }
  }

  async function handleRemovePhoto(index: number) {
    await persist(photos.filter((_, itemIndex) => itemIndex !== index));
  }

  function renderSlotContent(uri: string) {
    const iconName = PLACEHOLDER_ICONS[uri];
    if (iconName) {
      return <Ionicons name={iconName} size={36} color={colors.textMuted} />;
    }
    return <Image source={{ uri }} style={styles.photoImage} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Photos</Text>
            <Text style={styles.headerCount}>
              {photos.length} of {maxPhotos}
            </Text>
          </View>

          <View style={styles.grid}>
            {Array.from({ length: maxPhotos }, (_, index) => {
              const uri = photos[index];
              return (
                <View key={index} style={styles.photoBox}>
                  {uri ? (
                    <>
                      {renderSlotContent(uri)}
                      {index === 0 ? (
                        <View style={styles.mainBadge}>
                          <Text style={styles.mainBadgeText}>MAIN</Text>
                        </View>
                      ) : null}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemovePhoto(index)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="close" size={14} color={colors.white} />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity style={styles.addSlot} onPress={handleAddPhoto} activeOpacity={0.8}>
                      <Ionicons name="add" size={28} color={colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          <ElevatedCard style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Photo tips</Text>
            {TIPS.map((tip) => (
              <Text key={tip} style={styles.tipText}>
                · {tip}
              </Text>
            ))}
          </ElevatedCard>

          <AppButton
            title={saving ? 'Saving…' : 'Add photo'}
            onPress={handleAddPhoto}
            disabled={photos.length >= maxPhotos || saving}
          />
        </ScrollView>
      </AsyncBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.h2,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginLeft: spacing.md,
  },
  headerCount: {
    fontSize: typography.body,
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  photoBox: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  addSlot: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  mainBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  mainBadgeText: {
    fontSize: 11,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsCard: {
    marginBottom: spacing.lg,
  },
  tipsTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
});
