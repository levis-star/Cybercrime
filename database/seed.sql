insert into awareness_content (category, language, title, content)
values
  ('mobile-money', 'en', 'Protect your mobile money wallet', 'Keep your PIN private, verify agent numbers, and report suspicious calls immediately.'),
  ('phishing', 'sw', 'Tambua ujumbe wa hadaa', 'Angalia viungo visivyo rasmi, makosa ya lugha, na maombi ya taarifa binafsi.'),
  ('schools', 'en', 'School cyber hygiene checklist', 'Use strong passwords, avoid public device logins, and ask for help before sending money online.');

insert into alerts (title, content, language, target_region, severity_level)
values
  ('Mobile Money OTP Scam', 'Do not share one-time passwords with callers claiming to be agents.', 'en', 'National', 'high'),
  ('Tahadhari: Ajira Bandia', 'Usitume ada ya usaili kwa namba binafsi bila kuthibitisha tangazo.', 'sw', 'National', 'medium');
