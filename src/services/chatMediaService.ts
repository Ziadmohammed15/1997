import { supabase } from './supabaseClient';
import Compressor from 'compressorjs';
import RecordRTC from 'recordrtc';

/**
 * خدمة إدارة الوسائط في المحادثات
 */

// تحميل الصور
export const uploadImage = async (file: File, userId: string): Promise<string | null> => {
  try {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        success: async (compressedFile) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${userId}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('chat_images')
            .upload(fileName, compressedFile);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('chat_images')
            .getPublicUrl(fileName);
          
          resolve(publicUrl);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

// تسجيل الصوت
export const startVoiceRecording = (): RecordRTC => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/webm',
          recorderType: RecordRTC.StereoAudioRecorder,
          numberOfAudioChannels: 1,
          desiredSampRate: 16000,
          timeSlice: 1000
        });
        
        recorder.startRecording();
        resolve(recorder);
      })
      .catch(reject);
  });
};

// إيقاف التسجيل وتحميل الملف
export const stopVoiceRecording = async (
  recorder: RecordRTC,
  userId: string
): Promise<string | null> => {
  try {
    return new Promise((resolve, reject) => {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        const fileName = `${userId}/${Date.now()}.webm`;
        
        supabase.storage
          .from('chat_audio')
          .upload(fileName, blob)
          .then(({ error }) => {
            if (error) throw error;
            
            const { data: { publicUrl } } = supabase.storage
              .from('chat_audio')
              .getPublicUrl(fileName);
            
            resolve(publicUrl);
          })
          .catch(reject);
      });
    });
  } catch (error) {
    console.error('Error uploading voice recording:', error);
    return null;
  }
};

// حذف ملف وسائط
export const deleteMediaFile = async (url: string): Promise<boolean> => {
  try {
    const path = url.split('/').slice(-2).join('/');
    const { error } = await supabase.storage
      .from('chat_media')
      .remove([path]);
      
    return !error;
  } catch (error) {
    console.error('Error deleting media file:', error);
    return false;
  }
};