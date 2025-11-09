import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Loader2, AlertCircle, TrendingUp, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DemoResult {
  explanation: string;
  solution: string;
  category: string;
  confidence: number;
  isDemo: boolean;
  remainingDemos: number;
  totalDemos: number;
  resetTime: string;
  upgradeMessage: string;
  upgradeUrl: string;
}

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedbackClick?: () => void;
}

const LiveDemoModal: React.FC<LiveDemoModalProps> = ({ isOpen, onClose, onFeedbackClick }) => {
