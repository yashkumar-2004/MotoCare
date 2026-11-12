import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Star,
  MapPin,
  Calendar,
  ArrowRight,
  ChevronLeft,
  Wrench,
  ThumbsUp,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { servicePackageService } from '../services/servicePackageService';
import { centreService } from '../services/centreService';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ServicePlaceholder } from '../components/cards/ServiceCard';
import { ErrorState } from '../components/common/ErrorState';

export const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectServiceForBooking, goToStep } = useBooking();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [srv, revList, scList] = await Promise.all([
          servicePackageService.getById(id),
          servicePackageService.getReviews(id),
          centreService.getAll(),
        ]);
        setService(srv);
        setReviews(revList);
        setCentres(scList);
      } catch (err) {
        console.error('Failed to load service details', err);
        setError('Service package details could not be found or loaded.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceData();
    }
  }, [id]);

  const handleBookNow = () => {
    if (service) {
      selectServiceForBooking(service);
      goToStep(1); // start at vehicle selection
      navigate('/booking');
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading service package specs...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <ErrorState
          title="Service Package Not Found"
          message={error || 'The requested maintenance package does not exist or has been modified.'}
          onRetry={() => navigate('/services')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back button breadcrumb */}
      <div>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to All Packages
        </Link>
      </div>

      {/* Main Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: Image / Visual Banner (5 cols) */}
          <div className="lg:col-span-5 h-64 lg:h-auto min-h-[320px] relative bg-slate-100">
            {service.image && !imgError ? (
              <img
                src={service.image}
                alt={service.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <ServicePlaceholder />
            )}

            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg">
              {service.category}
            </div>

            {service.isPopular && (
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                Delhi NCR Best Seller
              </div>
            )}
          </div>

          {/* Right: Overview & CTA (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{service.rating} / 5.0</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Based on {service.reviewCount || 120} verified dealer jobs
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {service.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {service.description}
              </p>

              {/* Service Meta Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Duration</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">{service.duration}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Warranty</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {service.warranty || '30-Day Guarantee'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Interval</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {service.recommendedInterval || 'Every 4,000 km'}
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block line-through">
                  {service.originalPrice ? `M.R.P. ${formatCurrency(service.originalPrice)}` : ''}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    {formatCurrency(service.price)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Inclusive of Labor & Fluids
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Book This Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Included Services Checklist */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              What's Included in This Service
            </h2>
            <p className="text-xs text-slate-500">
              Every job is performed according to strict manufacturer torque specs and safety guidelines
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
          {(service.includedItems || []).map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs text-slate-700 font-medium"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Delhi NCR Service Centres */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Available at 6 Delhi NCR Workshop Bays
          </h2>
          <p className="text-xs text-slate-500">
            Book online and choose your nearest specialized dealership hub
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {centres.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {c.zone}
                </span>
                <span className="text-xs font-semibold text-slate-500">{c.totalBays} Bays</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{c.address}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span>{c.openingHours}</span>
                <a href={`tel:${c.phone}`} className="text-blue-600 font-semibold hover:underline">
                  Call Hub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              Verified Delhi NCR Customer Reviews
            </h2>
            <p className="text-xs text-slate-500">
              Genuine feedback from riders serviced across our network
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-slate-900">{service.rating} / 5</div>
            <span className="text-[11px] text-slate-400 font-medium">100% Verified Work</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{rev.customerName}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">{rev.vehicle}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Dealership Service
                  </span>
                  <span>{formatDate(rev.date)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 col-span-2 py-4">No reviews yet for this specific package.</p>
          )}
        </div>
      </div>
    </div>
  );
};
