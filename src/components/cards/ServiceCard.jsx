import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Star, ArrowRight, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useBooking } from '../../context/BookingContext';

export const ServicePlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900 flex flex-col items-center justify-center text-white/80 p-4">
    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2">
      <Wrench className="w-6 h-6 text-blue-300" />
    </div>
    <span className="text-xs font-semibold text-blue-200">MotoCare Certified Care</span>
  </div>
);

export const ServiceCard = ({ service }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { selectServiceForBooking, goToStep } = useBooking();

  const handleBookNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectServiceForBooking(service);
    goToStep(1); // start at vehicle selection
    navigate('/booking');
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Service Image Banner */}
      <div className="h-48 w-full relative bg-slate-100 overflow-hidden">
        {service.image && !imageError ? (
          <img
            src={service.image}
            alt={service.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ServicePlaceholder />
        )}

        {/* Popular Tag */}
        {service.isPopular && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            Most Popular
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg">
          {service.category}
        </div>

        {/* Rating Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>{service.rating || '4.8'}</span>
          <span className="text-slate-400 text-[10px]">({service.reviewCount || 120})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition mb-1">
            <Link to={`/services/${service.id}`}>
              {service.title}
            </Link>
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {service.shortDescription || service.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-600 mb-4 py-2 border-y border-slate-100">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{service.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate">{service.warranty ? service.warranty.split(' ')[0] + ' Guarantee' : 'Guaranteed'}</span>
            </div>
          </div>
        </div>

        {/* Footer with Price and Buttons */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 line-through">
              {service.originalPrice ? formatCurrency(service.originalPrice) : ''}
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {formatCurrency(service.price)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/services/${service.id}`}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Details
            </Link>
            <button
              onClick={handleBookNow}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition"
            >
              Book
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
