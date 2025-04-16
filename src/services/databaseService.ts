import { supabase } from './supabaseClient';
import type { Service } from '../types/service';

/**
 * خدمة التعامل مع قاعدة البيانات
 */

// إضافة خدمة جديدة
export const addService = async (
  service: Omit<Service, 'id' | 'rating'>,
  imageFile: File | null,
  deliveryOptions?: {
    type: 'free' | 'paid' | 'none' | 'company';
    price?: number;
    companyName?: string;
    areas: string[];
    estimatedTime: string;
  }
): Promise<{ data: any; error: any }> => {
  try {
    let imageUrl = service.image;

    // Upload image if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('services')
        .upload(fileName, imageFile);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('services')
        .getPublicUrl(fileName);
        
      imageUrl = publicUrl;
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    // Add service
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .insert({
        title: service.title,
        description: service.description,
        price: Number(service.price),
        category: service.category,
        subcategory: service.subcategory || null,
        location: service.location,
        image_url: imageUrl,
        provider_id: user.id,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (serviceError) throw serviceError;

    // Add features
    if (service.features.length > 0) {
      const { error: featuresError } = await supabase
        .from('service_features')
        .insert(
          service.features.map(feature => ({
            service_id: serviceData.id,
            feature,
            created_at: new Date().toISOString()
          }))
        );

      if (featuresError) throw featuresError;
    }

    // Add delivery options
    if (deliveryOptions && deliveryOptions.type !== 'none') {
      const { error: deliveryError } = await supabase
        .from('delivery_options')
        .insert({
          service_id: serviceData.id,
          type: deliveryOptions.type,
          price: deliveryOptions.type === 'paid' ? deliveryOptions.price : null,
          company_name: deliveryOptions.type === 'company' ? deliveryOptions.companyName : null,
          estimated_time: deliveryOptions.estimatedTime,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (deliveryError) throw deliveryError;

      // Add delivery areas
      if (deliveryOptions.areas.length > 0) {
        const { error: areasError } = await supabase
          .from('service_areas')
          .insert(
            deliveryOptions.areas.map(area => ({
              service_id: serviceData.id,
              area_name: area,
              created_at: new Date().toISOString()
            }))
          );

        if (areasError) throw areasError;
      }
    }

    return { data: serviceData, error: null };
  } catch (error) {
    console.error('Error adding service:', error);
    return { data: null, error };
  }
};

// تحديث خدمة
export const updateService = async (
  serviceId: string,
  updates: Partial<Service>,
  imageFile?: File | null,
  deliveryOptions?: {
    type: 'free' | 'paid' | 'none' | 'company';
    price?: number;
    companyName?: string;
    areas: string[];
    estimatedTime: string;
  }
): Promise<{ data: any; error: any }> => {
  try {
    let imageUrl = updates.image;

    // Upload new image if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('services')
        .upload(fileName, imageFile);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('services')
        .getPublicUrl(fileName);
        
      imageUrl = publicUrl;
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    // Update service
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .update({
        title: updates.title,
        description: updates.description,
        price: updates.price ? Number(updates.price) : undefined,
        category: updates.category,
        subcategory: updates.subcategory,
        location: updates.location,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId)
      .eq('provider_id', user.id) // Ensure user owns the service
      .select()
      .single();

    if (serviceError) throw serviceError;

    // Update features
    if (updates.features) {
      // Delete existing features
      await supabase
        .from('service_features')
        .delete()
        .eq('service_id', serviceId);

      // Add new features
      if (updates.features.length > 0) {
        const { error: featuresError } = await supabase
          .from('service_features')
          .insert(
            updates.features.map(feature => ({
              service_id: serviceId,
              feature
            }))
          );

        if (featuresError) throw featuresError;
      }
    }

    // Update delivery options
    if (deliveryOptions) {
      // Delete existing options
      await supabase
        .from('delivery_options')
        .delete()
        .eq('service_id', serviceId);

      await supabase
        .from('service_areas')
        .delete()
        .eq('service_id', serviceId);

      // Add new options if not 'none'
      if (deliveryOptions.type !== 'none') {
        const { error: deliveryError } = await supabase
          .from('delivery_options')
          .insert({
            service_id: serviceId,
            type: deliveryOptions.type,
            price: deliveryOptions.type === 'paid' ? deliveryOptions.price : null,
            company_name: deliveryOptions.type === 'company' ? deliveryOptions.companyName : null,
            estimated_time: deliveryOptions.estimatedTime
          });

        if (deliveryError) throw deliveryError;

        // Add new areas
        if (deliveryOptions.areas.length > 0) {
          const { error: areasError } = await supabase
            .from('service_areas')
            .insert(
              deliveryOptions.areas.map(area => ({
                service_id: serviceId,
                area_name: area
              }))
            );

          if (areasError) throw areasError;
        }
      }
    }

    return { data: serviceData, error: null };
  } catch (error) {
    console.error('Error updating service:', error);
    return { data: null, error };
  }
};

// حذف خدمة
export const deleteService = async (serviceId: string): Promise<{ error: any }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)
      .eq('provider_id', user.id); // Ensure user owns the service

    return { error };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { error };
  }
};

// جلب الخدمات
export const getServices = async (filters?: {
  category?: string;
  search?: string;
  provider_id?: string;
  status?: 'active' | 'inactive';
}): Promise<{ data: Service[]; error: any }> => {
  try {
    let query = supabase
      .from('services')
      .select(`
        *,
        provider:profiles(*),
        features:service_features(feature),
        delivery_options:delivery_options(*),
        areas:service_areas(area_name)
      `);

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.provider_id) {
      query = query.eq('provider_id', filters.provider_id);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Format data
    const formattedServices: Service[] = data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      rating: service.rating || 0,
      image: service.image_url,
      location: service.location,
      category: service.category,
      subcategory: service.subcategory,
      features: service.features.map((f: any) => f.feature),
      provider: service.provider ? {
        id: service.provider.id,
        name: service.provider.name,
        avatar: service.provider.avatar_url,
        rating: service.provider.rating,
        verified: service.provider.verified
      } : undefined,
      deliveryOptions: service.delivery_options ? {
        type: service.delivery_options.type,
        price: service.delivery_options.price,
        companyName: service.delivery_options.company_name,
        areas: service.areas.map((a: any) => a.area_name),
        estimatedTime: service.delivery_options.estimated_time
      } : undefined
    }));

    return { data: formattedServices, error: null };
  } catch (error) {
    console.error('Error fetching services:', error);
    return { data: [], error };
  }
};