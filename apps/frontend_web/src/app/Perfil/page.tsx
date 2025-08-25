"use client"

import React, { useState, useEffect } from "react"
import { Plantilla } from "../../components/plantilla";
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import { useAuth, useRequireAuth } from "@/hooks/useAuth";
import { Profile, profileApiService } from "@/services/profileApi";
import { mapBackendProfileToFrontend } from "@/utils/mappers";

export default function perfil(){
    // Protect route - require authentication
    const auth = useRequireAuth();
    const router = useRouter();

    // Profile state
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Editing state
    const [editando, setEditando] = useState(false);
    const [tempProfile, setTempProfile] = useState<Partial<Profile>>({});
    
    // Photo handling
    const [nuevaFoto, setNuevaFoto] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    // Load profile data on mount
    useEffect(() => {
        const loadProfile = async () => {
            console.log('🔍 Auth user data:', auth.user);
            console.log('🔍 Auth profile data:', auth.profile);

            // First, try to use the profile from auth context
            if (auth.profile) {
                try {
                    console.log('✅ Using profile from auth context');
                    // Map the auth.profile to our frontend format
                    const mappedProfile = mapBackendProfileToFrontend(auth.profile);
                    setProfile(mappedProfile);
                    setTempProfile(mappedProfile);
                    setLoading(false);
                    return;
                } catch (err) {
                    console.log('❌ Failed to map auth.profile, trying API call');
                    console.error('Mapping error:', err);
                }
            }

            // Fallback: try to load profile via API
            if (!auth.user?.id) {
                console.log('❌ No user ID available');
                setError('Usuario no encontrado');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                console.log('🔍 Loading profile via API for user:', auth.user.id);
                const profileData = await profileApiService.getProfile(auth.user.id);
                
                setProfile(profileData);
                setTempProfile(profileData); // Initialize temp with current data
                console.log('✅ Profile loaded via API:', profileData);
                
            } catch (err) {
                console.error('❌ Error loading profile:', err);
                
                // If profile doesn't exist, create a temporary one for editing
                if (err instanceof Error && err.message.includes('no encontrado')) {
                    console.log('🆕 Creating temporary profile for new user');
                    const tempProfile: Profile = {
                        id: auth.user.id,
                        nombre: auth.user.nombre || '',
                        apellido: auth.user.apellido || '',
                        telefono: '',
                        estado: '',
                        ciudad: '',
                        fraccionamiento: '',
                        calle: '',
                        codigoPostal: '',
                        avatar: 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
                        direccionCompleta: '',
                        nombreCompleto: `${auth.user.nombre || ''} ${auth.user.apellido || ''}`.trim(),
                    };
                    setProfile(tempProfile);
                    setTempProfile(tempProfile);
                } else {
                    setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
                }
            } finally {
                setLoading(false);
            }
        };

        if (auth.user && !profile && !loading) {
            loadProfile();
        }
    }, [auth.user?.id, auth.profile?.id, profile, loading]);

    const handleLogout = () => {
        auth.logout();
        router.push("/");
    };

    const handleEditar = () => {
        if (!profile) return;
        setTempProfile({ ...profile }); // Reset temp data to current profile
        setNuevaFoto(null);
        setEditando(true);
    };

    const handleCancelar = () => {
        if (!profile) return;
        setTempProfile({ ...profile }); // Reset temp data
        setNuevaFoto(null);
        setEditando(false);
    };

    const handleGuardar = async () => {
        if (!profile || !auth.user?.id) return;

        try {
            setLoading(true);
            
            // Check if profile exists or if we need to create it
            let updatedProfile: Profile;
            
            try {
                // Try to update existing profile
                updatedProfile = await profileApiService.updateProfile(auth.user.id, tempProfile);
                console.log('✅ Profile updated:', updatedProfile);
            } catch (updateError) {
                // If profile doesn't exist, try to create it
                if (updateError instanceof Error && updateError.message.includes('no encontrado')) {
                    console.log('🆕 Profile not found, creating new one');
                    updatedProfile = await profileApiService.createProfile({
                        nombre: tempProfile.nombre || '',
                        apellido: tempProfile.apellido || '', 
                        numero: tempProfile.telefono || '',
                        estado: tempProfile.estado || '',
                        ciudad: tempProfile.ciudad || '',
                        fraccionamiento: tempProfile.fraccionamiento || '',
                        calle: tempProfile.calle || '',
                        codigoPostal: tempProfile.codigoPostal || '',
                    });
                    console.log('✅ Profile created:', updatedProfile);
                } else {
                    throw updateError; // Re-throw if it's a different error
                }
            }
            
            setProfile(updatedProfile);
            
            // Upload new photo if selected
            if (nuevaFoto && nuevaFoto.startsWith('data:')) {
                setUploadingPhoto(true);
                try {
                    // Convert base64 to file
                    const response = await fetch(nuevaFoto);
                    const blob = await response.blob();
                    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
                    
                    // Upload avatar
                    const uploadResult = await profileApiService.uploadAvatar(auth.user.id, file);
                    
                    // Update profile with new avatar URL
                    const finalProfile = { ...updatedProfile, avatar: uploadResult.url };
                    setProfile(finalProfile);
                    
                } catch (uploadError) {
                    console.error('❌ Error uploading avatar:', uploadError);
                    // Don't fail the whole save, just log the error
                } finally {
                    setUploadingPhoto(false);
                }
            }
            
            setNuevaFoto(null);
            setEditando(false);
            console.log('✅ Profile updated successfully');
            
        } catch (err) {
            console.error('❌ Error saving profile:', err);
            setError(err instanceof Error ? err.message : 'Error al guardar el perfil');
        } finally {
            setLoading(false);
        }
    };

    // Foto de perfil: input y drag&drop solo en modo edición
    const handleEditarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]){
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function(ev) {
                if (ev.target && typeof ev.target.result === "string") {
                    setNuevaFoto(ev.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Helper function to update temp profile fields
    const updateTempProfileField = (field: keyof Profile, value: string) => {
        setTempProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const [dragActive, setDragActive] = useState(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (editando && e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    if (ev.target && typeof ev.target.result === "string") {
                        setNuevaFoto(ev.target.result);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (editando) {
            e.preventDefault();
            setDragActive(true);
        }
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (editando) {
            e.preventDefault();
            setDragActive(false);
        }
    };

    // Show loading state
    if (loading && !profile) {
        return (
            <Plantilla>
                <div className="max-w-4xl min-w-full mx-auto p-8 px-8 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando perfil...</p>
                        </div>
                    </div>
                </div>
            </Plantilla>
        );
    }

    // Show error state
    if (error) {
        return (
            <Plantilla>
                <div className="max-w-4xl min-w-full mx-auto p-8 px-8 py-8">
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                        >
                            Recargar
                        </button>
                    </div>
                </div>
            </Plantilla>
        );
    }

    // Show message if no profile found
    if (!profile) {
        return (
            <Plantilla>
                <div className="max-w-4xl min-w-full mx-auto p-8 px-8 py-8">
                    <div className="text-center py-12">
                        <p className="text-gray-600">No se encontró información del perfil.</p>
                    </div>
                </div>
            </Plantilla>
        );
    }

    return (
        <Plantilla>
            <div className="max-w-4xl min-w-full mx-auto p-8 px-8 py-8">
                <div className="flex items-center mb-8">
                    <div className={`relative ${dragActive ? "ring-4 ring-blue-400" : ""}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragLeave={handleDragLeave}
                    >
                        <img
                            src={nuevaFoto || profile.avatar || 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'}
                            alt="Foto de perfil"
                            className="w-20 h-20 rounded-full mr-4 object-cover"
                        />
                        {editando && (
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleEditarFoto}
                                onClick={e => (e.currentTarget.value = "")}
                            />
                        )}
                        {dragActive && editando && (
                            <div className="absolute inset-0 bg-blue-200 bg-opacity-40 flex items-center justify-center rounded-full pointer-events-none">
                                <span className="text-blue-700 font-semibold">Suelta la imagen aquí</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-medium">{profile.nombreCompleto || `${profile.nombre} ${profile.apellido}`}</h2> 
                            <p className="text-gray-600">{profile.ciudad}, {profile.estado}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full border-t-2 border-b-2 border-gray-200 py-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Datos personales</h3>
                        {editando ? (
                            <div className="flex items-center gap-2">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition disabled:opacity-50"
                                    onClick={handleCancelar}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                                    onClick={handleGuardar}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            {uploadingPhoto ? 'Subiendo foto...' : 'Guardando...'}
                                        </>
                                    ) : (
                                        'Guardar'
                                    )}
                                </button>
                            </div>
                        ) : (
                            <button
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-1 py-1 rounded-lg border border-gray-300 transition text-md font-inter flex items-center gap-2 disabled:opacity-50"
                                onClick={handleEditar}
                                disabled={loading}
                            >
                                Editar
                                <FiEdit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-6">
                            <label className="text-sm text-gray-600">Nombre</label>
                            <input
                                type="text"
                                value={editando ? (tempProfile.nombre || '') : (profile.nombre || '')}
                                onChange={(e) => updateTempProfileField('nombre', e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? 'bg-gray-50' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Apellido</label>
                            <input
                                type="text"
                                value={editando ? (tempProfile.apellido || '') : (profile.apellido || '')}
                                onChange={(e) => updateTempProfileField('apellido', e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? 'bg-gray-50' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Correo Electrónico</label>
                            <input
                                type="email"
                                value={auth.user?.correo || ''}
                                readOnly={true}
                                className="w-full border rounded p-2 bg-gray-50 text-gray-500"
                                title="El correo no se puede modificar"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Teléfono</label>
                            <input
                                type="text"
                                value={editando ? (tempProfile.telefono || '') : (profile.telefono || '')}
                                onChange={(e) => updateTempProfileField('telefono', e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? 'bg-gray-50' : ''}`}
                                placeholder="Ejemplo: 6183316693"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Estado</label>
                            <input
                                type="text"
                                value={editando ? (tempProfile.estado || '') : (profile.estado || '')}
                                onChange={(e) => updateTempProfileField('estado', e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? 'bg-gray-50' : ''}`}
                                placeholder="Ejemplo: Durango"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Ciudad</label>
                            <input
                                type="text"
                                value={editando ? (tempProfile.ciudad || '') : (profile.ciudad || '')}
                                onChange={(e) => updateTempProfileField('ciudad', e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? 'bg-gray-50' : ''}`}
                                placeholder="Ejemplo: Victoria de Durango"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Fraccionamiento/Colonia</label>
                            <input
                                type="text"
                                value={editando ? (tempProfile.fraccionamiento || '') : (profile.fraccionamiento || '')}
                                onChange={(e) => updateTempProfileField('fraccionamiento', e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? 'bg-gray-50' : ''}`}
                                placeholder="Ejemplo: Centro"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Calle</label>
                            <input
                                type="text"
                                value={editando ? (tempProfile.calle || '') : (profile.calle || '')}
                                onChange={(e) => updateTempProfileField('calle', e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? 'bg-gray-50' : ''}`}
                                placeholder="Ejemplo: Av. Principal 123"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Código Postal</label>
                            <input
                                type="text"
                                value={editando ? (tempProfile.codigoPostal || '') : (profile.codigoPostal || '')}
                                onChange={(e) => updateTempProfileField('codigoPostal', e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? 'bg-gray-50' : ''}`}
                                placeholder="Ejemplo: 34000"
                                maxLength={5}
                            />
                        </div>
                    </div>
                </div>
                <div className="text-center mt-12">
                    <button className="bg-white text-gray-700 py-2 w-200 rounded border border-gray-300 shadow-sm hover:bg-gray-100 transition"
                        onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </Plantilla>
    ) 
}

