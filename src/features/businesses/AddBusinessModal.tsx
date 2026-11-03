import React, { useState } from 'react';
import { Building2, MapPin, Globe, Phone, Plus, Hash } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { BusinessLocation, BusinessCategory } from '../../types/business';

export interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBusiness: (newBiz: BusinessLocation) => void;
}

export const AddBusinessModal: React.FC<AddBusinessModalProps> = ({
  isOpen,
  onClose,
  onAddBusiness,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('Dental Clinic');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [placeId, setPlaceId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;

    const formattedAddress = `${street || '100 Main St'}, ${city}, ${state || 'CA'} ${postalCode || '94101'}, USA`;

    const newLocation: BusinessLocation = {
      id: `biz_${Date.now()}`,
      placeId: placeId || `ChIJ_${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      category,
      address: {
        street: street.trim() || '100 Main St',
        city: city.trim(),
        state: state.trim() || 'CA',
        postalCode: postalCode.trim() || '94101',
        country: 'USA',
        formatted: formattedAddress,
      },
      coordinates: { latitude: 37.7749, longitude: -122.4194 },
      phoneNumber: phoneNumber.trim() || '+1 (555) 019-2831',
      websiteUrl: websiteUrl.trim() || 'https://example.com',
      googleMapsUrl: 'https://maps.google.com/?cid=' + Date.now(),
      rating: 5.0,
      reviewCount: 0,
      syncStatus: 'synced',
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isMock: true,
    };

    onAddBusiness(newLocation);
    // Reset form
    setName('');
    setStreet('');
    setCity('');
    setState('');
    setPostalCode('');
    setPhoneNumber('');
    setWebsiteUrl('');
    setPlaceId('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Business Location"
      description="Connect a verified Google Business Profile location or import by Places ID."
      maxWidth="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!name.trim() || !city.trim()}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add & Synchronize
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Name */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">
            Business Name *
          </label>
          <Input
            placeholder="e.g. Apex Health Center"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            leftIcon={<Building2 className="w-4 h-4" />}
          />
        </div>

        {/* Category & Place ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Business Category
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as BusinessCategory)}
            >
              <option value="Dental Clinic">Dental Clinic</option>
              <option value="Specialty Coffee">Specialty Coffee</option>
              <option value="Law Practice">Law Practice</option>
              <option value="Boutique Hotel">Boutique Hotel</option>
              <option value="Automotive Repair">Automotive Repair</option>
              <option value="Artisan Bakery">Artisan Bakery</option>
              <option value="Fitness Studio">Fitness Studio</option>
              <option value="Architecture & Design">Architecture & Design</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Google Places ID (Optional)
            </label>
            <Input
              placeholder="ChIJ..."
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              leftIcon={<Hash className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">
            Street Address
          </label>
          <Input
            placeholder="e.g. 128 Market Boulevard, Suite 400"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            leftIcon={<MapPin className="w-4 h-4" />}
          />
        </div>

        {/* City, State, Postal */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              City *
            </label>
            <Input
              placeholder="Seattle"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              State
            </label>
            <Input
              placeholder="WA"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Postal Code
            </label>
            <Input
              placeholder="98101"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
        </div>

        {/* Phone & Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Phone Number
            </label>
            <Input
              placeholder="+1 (206) 555-0100"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">
              Website URL
            </label>
            <Input
              placeholder="https://company.example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              leftIcon={<Globe className="w-4 h-4" />}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

