'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, MessageSquare, Download, Share2, Lock, Unlock, X, 
  ChevronLeft, ChevronRight, Check, Send, AlertCircle, Sparkles,
  ShieldCheck, Eye, IndianRupee, QrCode, Smartphone, Copy, ExternalLink, Globe, CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project, Selection, DrivePhoto } from '@/types/database';
import { SAMPLE_DRIVE_PHOTOS } from '@/lib/gdrive';
import { 
  getLocalProjects, 
  getLocalSelections, 
  saveLocalSelections, 
  saveLocalProjects 
} from '@/lib/mockStore';
import { generateWhatsAppLink, generateUpiPaymentUrl } from '@/lib/utils';

export default function ClientGalleryPage({ params }: { params?: { slug?: string } }) {
  const routeParams = useParams();
  const slug = (params?.slug || (routeParams?.slug as string) || '');

  const [project, setProject] = useState<Project | null>(null);
  const [photos, setPhotos] = useState<DrivePhoto[]>([]);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all');
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // PIN Gate State
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Lightbox Modal State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Comment Modal State
  const [activeCommentPhoto, setActiveCommentPhoto] = useState<DrivePhoto | null>(null);
  const [commentText, setCommentText] = useState('');

  // Submit Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // UPI Payment Modal State
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [utrInput, setUtrInput] = useState('');
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);
  const [utrSuccess, setUtrSuccess] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Touch Swipe coordinates for Lightbox
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cursor pagination loader
  const handleLoadMore = async () => {
    if (!project || !nextPageToken || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/gdrive?folderId=${encodeURIComponent(project.drive_folder_id)}&slug=${encodeURIComponent(project.slug)}&pageToken=${encodeURIComponent(nextPageToken)}&pageSize=48`
      );
      const data = await res.json();
      if (data && data.files && data.files.length > 0) {
        setPhotos((prev) => [...prev, ...data.files]);
        setNextPageToken(data.nextPageToken || null);
      } else {
        setNextPageToken(null);
      }
    } catch (err) {
      console.error('Failed to load more photos:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Load project, photos & selections
  useEffect(() => {
    if (!slug) return;

    const initProject = (found: Project) => {
      setProject(found);
      setIsSubmitted(found.is_submitted);

      const isAlreadyUnlocked = 
        !found.access_pin || 
        (typeof window !== 'undefined' && sessionStorage.getItem(`proofpix_unlocked_${found.slug}`) === 'true');

      if (isAlreadyUnlocked) {
        setPinUnlocked(true);
      }

      // 1. Fetch selections from session-backed database API with local fallback
      fetch(`/api/gallery/selections?projectId=${encodeURIComponent(found.id)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.selections && data.selections.length > 0) {
            setSelections(data.selections);
            saveLocalSelections(found.id, data.selections);
          } else {
            const sels = getLocalSelections(found.id);
            setSelections(sels);
          }
        })
        .catch(() => {
          const sels = getLocalSelections(found.id);
          setSelections(sels);
        });

      // 2. Fetch Drive photos via /api/gdrive with slug for secure server proxy
      fetch(`/api/gdrive?folderId=${encodeURIComponent(found.drive_folder_id)}&slug=${encodeURIComponent(found.slug)}&pageSize=48`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.files && data.files.length > 0) {
            setPhotos(data.files);
            setNextPageToken(data.nextPageToken || null);
          } else {
            setPhotos(SAMPLE_DRIVE_PHOTOS);
            setNextPageToken(null);
          }
        })
        .catch(() => {
          setPhotos(SAMPLE_DRIVE_PHOTOS);
          setNextPageToken(null);
        })
        .finally(() => setLoading(false));
    };

    // 1. Try server-backed API first (so cross-device client links work immediately)
    fetch(`/api/projects?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.project) {
          initProject(data.project);
        } else {
          // Fallback to local storage or demo
          const allProjects = getLocalProjects();
          const localFound = allProjects.find((p) => p.slug === slug);
          if (localFound) {
            initProject(localFound);
          } else {
            initProject({
              id: 'proj-demo-generic',
              photographer_id: 'photographer-demo-1',
              slug: slug,
              event_name: 'Royal Destination Wedding Gallery',
              client_name: 'Priya Sharma',
              client_whatsapp: '919876543210',
              studio_whatsapp: '919876543210',
              drive_folder_id: 'demo-folder',
              max_selection: 100,
              watermark_text: 'The Royal Frames Studio',
              access_pin: '4829',
              balance_amount: 15000,
              razorpay_link: 'https://rzp.io/l/royalstudio',
              paypal_link: 'https://paypal.me/sagarkapdi',
              is_paid: false,
              is_submitted: false,
            });
          }
        }
      })
      .catch(() => {
        const allProjects = getLocalProjects();
        const localFound = allProjects.find((p) => p.slug === slug);
        if (localFound) {
          initProject(localFound);
        } else {
          initProject({
            id: 'proj-demo-generic',
            photographer_id: 'photographer-demo-1',
            slug: slug,
            event_name: 'Royal Destination Wedding Gallery',
            client_name: 'Priya Sharma',
            client_whatsapp: '919876543210',
            studio_whatsapp: '919876543210',
            drive_folder_id: 'demo-folder',
            max_selection: 100,
            watermark_text: 'The Royal Frames Studio',
            access_pin: '4829',
            balance_amount: 15000,
            razorpay_link: 'https://rzp.io/l/royalstudio',
            paypal_link: 'https://paypal.me/sagarkapdi',
            is_paid: false,
            is_submitted: false,
          });
        }
      });
  }, [slug]);

  // Handle PIN Submission with session persistence
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    
    const targetPin = project.access_pin?.trim();
    if (targetPin && enteredPin.trim() === targetPin) {
      setPinUnlocked(true);
      setPinError(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`proofpix_unlocked_${project.slug}`, 'true');
      }
      confetti({ particleCount: 50, spread: 60 });
    } else {
      setPinError(true);
    }
  };

  // Toggle Heart Selection
  const handleToggleHeart = (photo: DrivePhoto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!project) return;

    const isSelected = selections.some((s) => s.drive_file_id === photo.id);

    if (isSelected) {
      // Deselect
      const updated = selections.filter((s) => s.drive_file_id !== photo.id);
      setSelections(updated);
      saveLocalSelections(project.id, updated);
      showToast(`Removed from favorites`);

      // Sync to session-backed database API
      fetch(`/api/gallery/selections?projectId=${encodeURIComponent(project.id)}&driveFileId=${encodeURIComponent(photo.id)}`, {
        method: 'DELETE',
      }).catch(console.error);
    } else {
      // Check Max Limit
      if (selections.length >= project.max_selection) {
        showToast(`⚠️ Selection limit reached (${project.max_selection} photos). Deselect one to add another.`);
        return;
      }

      const newSelection: Selection = {
        id: `sel-${Date.now()}`,
        project_id: project.id,
        drive_file_id: photo.id,
        file_name: photo.name,
        comment: null,
        created_at: new Date().toISOString(),
      };

      const updated = [...selections, newSelection];
      setSelections(updated);
      saveLocalSelections(project.id, updated);
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
      showToast(`Added to favorites ❤️ (${updated.length}/${project.max_selection})`);

      // Sync to session-backed database API
      fetch(`/api/gallery/selections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          selection: newSelection,
        }),
      }).catch(console.error);
    }
  };

  // Open Comment Modal
  const handleOpenComment = (photo: DrivePhoto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveCommentPhoto(photo);
    const existing = selections.find((s) => s.drive_file_id === photo.id);
    setCommentText(existing?.comment || '');
  };

  // Save Comment
  const handleSaveComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !activeCommentPhoto) return;

    let updated: Selection[];
    const existing = selections.find((s) => s.drive_file_id === activeCommentPhoto.id);

    if (existing) {
      updated = selections.map((s) =>
        s.drive_file_id === activeCommentPhoto.id ? { ...s, comment: commentText.trim() || null } : s
      );
    } else {
      // Auto-favorite when adding note
      updated = [
        ...selections,
        {
          id: `sel-${Date.now()}`,
          project_id: project.id,
          drive_file_id: activeCommentPhoto.id,
          file_name: activeCommentPhoto.name,
          comment: commentText.trim() || null,
          created_at: new Date().toISOString(),
        },
      ];
    }

    setSelections(updated);
    saveLocalSelections(project.id, updated);
    setActiveCommentPhoto(null);
    showToast(`Note saved for editor 💬`);

    // Sync saved comment to session-backed database API
    const targetSel = updated.find((s) => s.drive_file_id === activeCommentPhoto.id);
    if (targetSel) {
      fetch(`/api/gallery/selections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          selection: targetSel,
        }),
      }).catch(console.error);
    }
  };

  // Submit Final Selection
  const handleSubmitSelection = () => {
    if (selections.length === 0) {
      showToast('Please select at least 1 photo before submitting.');
      return;
    }

    if (project) {
      const allProjects = getLocalProjects();
      const updatedProjects = allProjects.map((p) =>
        p.id === project.id ? { ...p, is_submitted: true, submitted_at: new Date().toISOString() } : p
      );
      saveLocalProjects(updatedProjects);
      setIsSubmitted(true);

      // Sync submission status to server so studio dashboard updates instantly
      fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          updates: { is_submitted: true, submitted_at: new Date().toISOString() },
        }),
      }).catch(console.error);
    }

    confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
    setIsSubmitModalOpen(true);
  };

  // Submit UTR reference for UPI payments
  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !utrInput.trim()) return;

    setIsSubmittingUtr(true);
    try {
      const res = await fetch('/api/payments/utr-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          client_name: project.client_name,
          client_phone: project.client_whatsapp,
          amount: 5000,
          utr_number: utrInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUtrSuccess(true);
        confetti({ particleCount: 40, spread: 50 });
        showToast('UTR reference submitted to studio');
      } else {
        alert(data.error || 'Failed to submit UTR');
      }
    } catch (err) {
      setUtrSuccess(true);
      showToast('UTR reference recorded');
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  // Filtered Photos List
  const displayedPhotos = photos.filter((photo) => {
    if (filterMode === 'favorites') {
      return selections.some((s) => s.drive_file_id === photo.id);
    }
    return true;
  });

  // Lightbox Navigation
  const handleNextPhoto = () => {
    if (lightboxIndex !== null && lightboxIndex < displayedPhotos.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  // Keyboard Navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, displayedPhotos.length]);

  // Touch Swipe for Mobile Lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // Swiped Left -> Next
      handleNextPhoto();
    } else if (diff < -50) {
      // Swiped Right -> Prev
      handlePrevPhoto();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-xs text-gray-500">
        Loading gallery from Google Drive...
      </div>
    );
  }

  // PIN PROTECTION SCREEN
  if (!pinUnlocked) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Private Delivery</span>
            <h2 className="font-serif text-2xl font-bold text-gray-950">{project.event_name}</h2>
            <p className="text-xs text-gray-500">
              Please enter the 4-digit access PIN provided by your photographer.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4 text-xs">
            {pinError && (
              <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
                Incorrect PIN. Please verify with your photographer.
              </div>
            )}

            <input
              type="password"
              maxLength={6}
              autoFocus
              placeholder="Enter PIN"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              className="w-full text-center tracking-[0.3em] font-mono text-lg py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black focus:bg-white"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-xs transition-colors"
            >
              Access Client Gallery
            </button>

            {project.access_pin && (
              <p className="text-[10px] text-gray-400 font-mono">
                PIN Hint for Demo: <strong>{project.access_pin}</strong>
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#FAFAFA] text-[#111827] flex flex-col pb-24 md:pb-12"
      onContextMenu={(e) => {
        // Disable right-click if payment is pending to protect photographer's files
        if (!project.is_paid) e.preventDefault();
      }}
    >
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg animate-fadeIn flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NOTIFICATION BANNER: PAYMENT STATUS & DOWNLOAD STATE */}
      <div className={`px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 border-b transition-colors ${
        project.is_paid 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center gap-2">
          {project.is_paid ? (
            <Unlock className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>
            {project.is_paid ? (
              <strong className="font-semibold text-emerald-800">
                Payment Cleared · Watermarks Removed · Full Resolution Downloads Unlocked
              </strong>
            ) : (
              <span>
                <strong>High-Res Downloads Locked</strong> — Complete balance payment with Studio to unlock original files & remove watermarks.
              </span>
            )}
          </span>
        </div>

        {!project.is_paid && (
          <button
            onClick={() => setIsUpiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-semibold text-[11px] transition-colors"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Pay via UPI / QR</span>
          </button>
        )}
      </div>

      {/* LUXURY MINIMALIST HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Studio Brand & Event Title */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
              {project.watermark_text || 'Studio Delivery'}
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-950">
              {project.event_name}
            </h1>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Filter Toggle: All vs Favorites */}
            <div className="flex items-center bg-gray-100 p-1 rounded-full text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                  filterMode === 'all'
                    ? 'bg-white text-black font-semibold shadow-xs'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                All ({photos.length})
              </button>
              <button
                onClick={() => setFilterMode('favorites')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
                  filterMode === 'favorites'
                    ? 'bg-rose-600 text-white font-semibold shadow-xs'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${selections.length > 0 ? 'fill-rose-600' : ''}`} />
                <span>Selected ({selections.length})</span>
              </button>
            </div>

            {/* Live Counter Badge */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 font-mono bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
              <span>Limit:</span>
              <strong className="text-gray-950 font-bold">{selections.length}</strong>
              <span>/</span>
              <span>{project.max_selection}</span>
            </div>

            {/* Submit Selection CTA Button */}
            <button
              onClick={handleSubmitSelection}
              className={`hidden sm:flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full font-semibold text-xs transition-all shadow-sm ${
                isSubmitted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Selection Submitted</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Selection ({selections.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MASONRY / RESPONSIVE PHOTO GRID */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {displayedPhotos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 space-y-3">
            <Heart className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-gray-900">No favorite photos selected yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Click the ❤️ heart icon on any photo to create your album selection list.
            </p>
            <button
              onClick={() => setFilterMode('all')}
              className="px-4 py-2 rounded-full bg-black text-white text-xs font-semibold"
            >
              Show All Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayedPhotos.map((photo, index) => {
              const isFav = selections.some((s) => s.drive_file_id === photo.id);
              const existingSel = selections.find((s) => s.drive_file_id === photo.id);
              const note = existingSel?.comment;

              return (
                <div
                  key={photo.id}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all flex flex-col justify-between"
                  onDragStart={(e) => {
                    if (!project.is_paid) e.preventDefault();
                  }}
                >
                  {/* Photo Thumbnail Container */}
                  <div
                    onClick={() => setLightboxIndex(index)}
                    className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer bg-gray-100 select-none"
                  >
                    <img
                      src={photo.thumbnailLink}
                      alt={photo.name}
                      loading="lazy"
                      className="w-full h-full object-cover filter brightness-[0.98] group-hover:brightness-105 group-hover:scale-103 transition-transform duration-500 pointer-events-none gallery-protected-image"
                    />

                    {/* DIAGONAL WATERMARK (ACTIVE WHEN is_paid == false) */}
                    {!project.is_paid && (
                      <div className="watermark-overlay">
                        <div className="watermark-text">
                          {project.watermark_text || 'PROOFPIX PREVIEW'}
                        </div>
                      </div>
                    )}

                    {/* Dark gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>

                  {/* Floating Action Buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                    {/* Heart Selection Toggle */}
                    <button
                      onClick={(e) => handleToggleHeart(photo, e)}
                      className={`p-2 rounded-full backdrop-blur-md transition-transform duration-150 active:scale-125 ${
                        isFav
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                          : 'bg-white/80 hover:bg-white text-gray-700 hover:text-black border border-gray-200'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Select photo for album'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                    </button>

                    {/* Editing Comment Note Button */}
                    <button
                      onClick={(e) => handleOpenComment(photo, e)}
                      className={`p-2 rounded-full backdrop-blur-md transition-all ${
                        note
                          ? 'bg-amber-400 text-black font-bold shadow-md'
                          : 'bg-white/80 hover:bg-white text-gray-700 hover:text-black border border-gray-200'
                      }`}
                      title={note ? `Note: "${note}"` : 'Add note for album editor'}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    {/* Download Button (Only enabled when is_paid == true) */}
                    {project.is_paid && (
                      <a
                        href={photo.webContentLink || photo.thumbnailLink}
                        download={photo.name}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-full bg-white/80 hover:bg-emerald-600 hover:text-white text-gray-700 transition-colors border border-gray-200"
                        title="Download high-resolution image"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Editor Note Tag if comment exists */}
                  {note && (
                    <div className="bg-amber-50 border-t border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-amber-900">
                      <span className="truncate font-medium">💬 Note: "{note}"</span>
                      <button
                        onClick={(e) => handleOpenComment(photo, e)}
                        className="underline text-[10px] shrink-0 ml-2"
                      >
                        Edit
                      </button>
                    </div>
                  )}

                  {/* Bottom Filename & Info Bar */}
                  <div className="p-3 bg-white flex items-center justify-between text-[11px] text-gray-500">
                    <span className="font-mono truncate">{photo.name}</span>
                    {photo.imageMediaMetadata?.cameraModel && (
                      <span className="text-[10px] text-gray-400 font-mono ml-2 shrink-0">
                        {photo.imageMediaMetadata.cameraModel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CURSOR-BASED PAGINATION / LOAD MORE */}
        {nextPageToken && filterMode === 'all' && (
          <div className="pt-8 pb-4 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-3 rounded-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold text-xs transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                  <span>Loading Next Photos...</span>
                </>
              ) : (
                <>
                  <span>Load More Photos</span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* MOBILE FLOATING BOTTOM PROOFING BAR */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-gray-200 p-3 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <Heart className="w-3.5 h-3.5 fill-rose-600" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-gray-950">{selections.length}</span>
            <span className="text-gray-500"> / {project.max_selection}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode(filterMode === 'all' ? 'favorites' : 'all')}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-gray-50"
          >
            {filterMode === 'all' ? 'View Selected' : 'Show All'}
          </button>
          <button
            onClick={handleSubmitSelection}
            className="px-4 py-1.5 rounded-xl bg-black text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL (WITH TOUCH SWIPE FOR MOBILE) */}
      {lightboxIndex !== null && displayedPhotos[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between animate-fadeIn text-white select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div className="p-4 flex items-center justify-between text-xs border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-gray-400">
                {lightboxIndex + 1} / {displayedPhotos.length}
              </span>
              <span className="font-medium truncate max-w-[160px] sm:max-w-md">
                {displayedPhotos[lightboxIndex].name}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Heart in Lightbox */}
              <button
                onClick={() => handleToggleHeart(displayedPhotos[lightboxIndex])}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selections.some((s) => s.drive_file_id === displayedPhotos[lightboxIndex].id)
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>
                  {selections.some((s) => s.drive_file_id === displayedPhotos[lightboxIndex].id)
                    ? 'Selected'
                    : 'Select'}
                </span>
              </button>

              {/* Note in Lightbox */}
              <button
                onClick={() => handleOpenComment(displayedPhotos[lightboxIndex])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Note</span>
              </button>

              {/* Close Lightbox */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Central Image with Watermark */}
          <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
            <button
              onClick={handlePrevPhoto}
              disabled={lightboxIndex === 0}
              className="hidden sm:flex absolute left-4 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white disabled:opacity-20 z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative max-h-full max-w-full flex items-center justify-center">
              <img
                src={displayedPhotos[lightboxIndex].fullViewLink || displayedPhotos[lightboxIndex].thumbnailLink}
                alt={displayedPhotos[lightboxIndex].name}
                className="max-h-[80vh] max-w-[92vw] object-contain rounded-lg shadow-2xl pointer-events-none gallery-protected-image"
              />

              {!project.is_paid && (
                <div className="watermark-overlay">
                  <div className="watermark-text">
                    {project.watermark_text || 'PROOFPIX PREVIEW'}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleNextPhoto}
              disabled={lightboxIndex === displayedPhotos.length - 1}
              className="hidden sm:flex absolute right-4 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white disabled:opacity-20 z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Lightbox Strip */}
          <div className="p-3 text-center text-xs text-gray-400 border-t border-white/10 font-mono">
            Swipe or use Left / Right keys · Tap outside or X to close
          </div>
        </div>
      )}

      {/* COMMENT / EDITING NOTE MODAL */}
      {activeCommentPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono text-rose-600 uppercase font-semibold">Album Design Instruction</span>
                <h4 className="font-serif text-lg font-bold text-gray-950 truncate max-w-xs">
                  {activeCommentPhoto.name}
                </h4>
              </div>
              <button
                onClick={() => setActiveCommentPhoto(null)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveComment} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">
                  Quick Presets for Indian Weddings:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'is photo ko album ke front page par rakhna',
                    'Full Panoramic 2-Page Spread',
                    'Back Cover Photo',
                    'Retouch smile and jewellery',
                    'Black & White Vintage Edit'
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setCommentText(preset)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Your Custom Note for the Studio:</label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="e.g. Please put this on the front cover of the Karizma album..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveCommentPhoto(null)}
                  className="px-4 py-2 text-gray-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-black hover:bg-gray-800 text-white font-semibold shadow-sm"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMISSION CONFIRMATION MODAL & 1-CLICK WHATSAPP SUMMARY */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider">
                Selection Saved Successfully
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-950">
                Photo Proofing Complete!
              </h3>
              <p className="text-xs text-gray-600">
                You have selected <strong>{selections.length} photos</strong> for the album. Notify your photographer instantly via WhatsApp to begin editing.
              </p>
            </div>

            {/* 1-Click WhatsApp Button */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-left">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>1-Click WhatsApp Summary for Studio</span>
              </div>
              <p className="text-[11px] text-gray-600">
                Sends the exact count, event name, and your proofing notes directly to the studio's WhatsApp.
              </p>

              <a
                href={generateWhatsAppLink({
                  phone: project.studio_whatsapp || '919876543210',
                  eventName: project.event_name,
                  clientName: project.client_name,
                  totalSelected: selections.length,
                  galleryUrl: typeof window !== 'undefined' ? window.location.href : '',
                  notesCount: selections.filter((s) => s.comment).length,
                  sampleFilenames: selections.map((s) => ({ fileName: s.file_name, comment: s.comment })),
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Send Summary to Photographer on WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="text-xs text-gray-500 hover:text-black font-semibold"
            >
              Continue Viewing Gallery
            </button>
          </div>
        </div>
      )}

      {/* MULTI-CHANNEL CLIENT CHECKOUT MODAL (UPI, RAZORPAY, PAYPAL & UTR) */}
      {isUpiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 space-y-5 shadow-2xl text-center max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-mono font-semibold text-gray-700 uppercase">Direct Studio Payment</span>
              </div>
              <button onClick={() => setIsUpiModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shoot Balance Header */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold tracking-wider">
                Pending Shoot Balance
              </span>
              <div className="font-serif text-3xl font-extrabold text-emerald-950">
                ₹{(project.balance_amount || 15000).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">
                100% of payment goes directly to <strong>{project.watermark_text || 'the studio'}</strong>. No middlemen.
              </p>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3 text-left">
              <div className="text-xs font-semibold text-gray-900">Choose How to Pay:</div>

              {/* OPTION 1: UPI SCAN & PAY */}
              <div className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-gray-900 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Instant UPI (GPay, PhonePe, Paytm, CRED)</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">0% Fees</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-1">
                  {/* Dynamic QR Code */}
                  <div className="w-32 h-32 bg-white border border-gray-300 rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        `upi://pay?pa=${project.profiles?.upi_id || 'royalstudio@oksbi'}&pn=${encodeURIComponent(
                          project.watermark_text || 'Studio'
                        )}&am=${project.balance_amount || 15000}&tn=${encodeURIComponent(project.event_name + '_Balance')}&cu=INR`
                      )}`}
                      alt="Studio Payment QR"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-2 flex-1 text-xs">
                    <a
                      href={generateUpiPaymentUrl({
                        upiId: project.profiles?.upi_id || 'royalstudio@oksbi',
                        studioName: project.watermark_text || 'Studio',
                        eventName: project.event_name,
                      })}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Open in UPI App</span>
                    </a>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(project.profiles?.upi_id || 'royalstudio@oksbi');
                        showToast('UPI ID copied to clipboard!');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 font-medium text-xs flex items-center justify-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                      <span className="truncate">Copy: {project.profiles?.upi_id || 'royalstudio@oksbi'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* OPTION 2: RAZORPAY LINK (CARDS / NETBANKING / WALLETS) */}
              {(project.razorpay_link || project.profiles?.razorpay_payment_link) && (
                <div className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-blue-950 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Cards / NetBanking / Wallets (Razorpay)</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Pay securely using Credit Cards, Debit Cards, NetBanking or EMI directly to the studio's Razorpay account.
                  </p>
                  <a
                    href={project.razorpay_link || project.profiles?.razorpay_payment_link || 'https://rzp.io/l/royalstudio'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <span>Pay with Cards via Razorpay</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* OPTION 3: PAYPAL (NRI & INTERNATIONAL CLIENTS) */}
              {(project.paypal_link || project.profiles?.paypal_me_link) && (
                <div className="p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-indigo-950 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <span>International / NRI Clients (PayPal)</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Pay from outside India in USD/EUR/GBP using any international card or PayPal balance.
                  </p>
                  <a
                    href={project.paypal_link || project.profiles?.paypal_me_link || 'https://paypal.me/sagarkapdi'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <span>Pay with PayPal (International)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* UTR Reference Submission for Instant Unlock */}
            <form onSubmit={handleUtrSubmit} className="space-y-2 pt-3 border-t border-gray-100 text-left">
              <label className="block text-[11px] font-semibold text-gray-700">
                Already Transferred? Enter 12-Digit Bank UTR / Transaction ID:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  maxLength={18}
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="e.g. 489210485912 or UPI Ref"
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono outline-none focus:border-black"
                />
                <button
                  type="submit"
                  disabled={isSubmittingUtr}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-semibold text-xs rounded-xl transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
                >
                  {isSubmittingUtr ? 'Verifying...' : 'Submit Ref'}
                </button>
              </div>

              {utrSuccess && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium animate-fadeIn">
                  ✅ Payment reference recorded! The photographer has been alerted to verify and unlock your high-res gallery.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
