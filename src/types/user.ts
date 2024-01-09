export type Language = {
  language: Languages;
  level: number;
};

export type Notification = {
  all: boolean;
};

export type RedDot = {
  friend: boolean;
};

export type MBTI =
  | 'ISTJ'
  | 'ISFJ'
  | 'INFJ'
  | 'INTJ'
  | 'ISTP'
  | 'ISFP'
  | 'INFP'
  | 'INTP'
  | 'ESTP'
  | 'ESFP'
  | 'ENFP'
  | 'ENTP'
  | 'ESTJ'
  | 'ESFJ'
  | 'ENFJ'
  | 'ENTJ';

export type Languages =
  | '한국어'
  | 'English'
  | 'Español'
  | 'Français'
  | 'Deutsch'
  | '中文(简体)'
  | '中文(繁體)'
  | '日本語'
  | 'Italiano'
  | 'Português'
  | 'Русский'
  | 'Nederlands'
  | 'العربية'
  | 'हिन्दी'
  | 'Türkçe'
  | 'Svenska'
  | 'Polski'
  | 'Čeština'
  | 'ภาษาไทย'
  | 'Ελληνικά'
  | 'Suomi'
  | 'Dansk'
  | 'Norsk'
  | 'فارسی'
  | 'Bahasa Melayu'
  | 'Magyar'
  | 'Tiếng Việt'
  | 'Українська'
  | 'Bahasa Indonesia';
