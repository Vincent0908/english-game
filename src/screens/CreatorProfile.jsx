// ================================================================
// CREATOR PROFILE PAGE
// ================================================================
// Untuk mengubah isi profil, edit bagian PROFILE_DATA di bawah ini
// ================================================================

const PROFILE_DATA = {
  // ----- INFO UTAMA -----
  name: 'Vincent Robin Christan Zebua',
  nim: '2505181051',
  class: 'TRPL-2A',
  university: 'Politeknik Negeri Medan',
  role: 'Student',
  quote: '"Learning a language is not about memorizing words, it\'s about experiencing it."',

  // ----- AVATAR / FOTO -----
  // Letakkan file foto kamu di folder: public/
  // Contoh: simpan sebagai  public/photo.jpg  lalu isi '/photo.jpg'
  // Format yang didukung: .jpg  .jpeg  .png  .webp
  // Biarkan null jika ingin pakai inisial nama
  avatarUrl: '/public/photo.jpg',

  // ----- ABOUT ME -----
  about: 'Seorang mahasiswa semester 2 di program studi Teknologi Rekayasa Perangkat Lunak di Politeknik Negeri Medan. Sangat senang belajar hal baru terutama di bidang IT',

  // ----- SKILLS -----
  skills: [
    { name: 'React.js',     level: 85, color: '#61dafb' },
    { name: 'JavaScript',   level: 80, color: '#f7df1e' },
    { name: 'Tailwind CSS', level: 75, color: '#38bdf8' },
    { name: 'HTML & CSS',   level: 90, color: '#e34f26' },
    { name: 'Git',          level: 70, color: '#f05032' },
  ],

  // ----- GAME STATS (deskripsi kontribusi) -----
  contributions: [
    { icon: '🎮', title: '4 Mini Games', desc: 'Designed and implemented all 4 game mechanics' },
    { icon: '🎨', title: 'UI / UX Design', desc: 'Dark glassmorphism theme with animations' },
    { icon: '📚', title: '100+ Questions', desc: 'Curated vocabulary, grammar & sentence data' },
    { icon: '⚙️', title: 'Game Logic', desc: 'Timer, lives, streak & scoring systems' },
  ],

  // ----- KONTAK -----
  contact: {
    email: 'vincentzebua0@gmail.com',
    github: 'github.com/Vincent0908',
    instagram: '@vnncntt',
  },
}

// ================================================================
// KOMPONEN UTAMA — tidak perlu diedit
// ================================================================

function CreatorProfile({ navigate }) {
  const p = PROFILE_DATA
  const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-quest relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="absolute rounded-full animate-twinkle" style={{
            left: `${(i * 37.3 + 11) % 100}%`,
            top:  `${(i * 53.7 + 7)  % 100}%`,
            width: `${(i % 3) + 1}px`,
            height: `${(i % 3) + 1}px`,
            background: i % 5 === 0 ? '#ffd700' : i % 3 === 0 ? '#7c3aed' : '#fff',
            opacity: 0.3,
            animationDelay: `${(i * 0.3) % 3}s`,
            animationDuration: `${2 + (i % 3)}s`,
          }} />
        ))}
      </div>

      {/* Glow orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ffd70008 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed08 0%, transparent 70%)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

        {/* Back button */}
        <button
          className="self-start flex items-center gap-2 glass-card px-4 py-2 rounded-xl text-slate-400 text-sm hover:text-slate-200 hover:bg-white/5 transition-all hover:-translate-x-0.5"
          onClick={() => navigate('select')}
        >
          ← Back to Quest Map
        </button>

        {/* === HERO CARD === */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 animate-fadeInUp"
          style={{ boxShadow: '0 0 60px #ffd70010, 0 0 1px #ffd70020' }}>

          {/* Avatar / Foto */}
          <div className="relative flex-shrink-0">
            {/*
              Container berbentuk lingkaran dengan ukuran responsif.
              Foto otomatis crop & resize memenuhi lingkaran (object-cover).
              Ukuran: 112×112 px di mobile, 144×144 px di layar ≥640px.
            */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-gold/40 shadow-[0_0_30px_#ffd70030] overflow-hidden flex-shrink-0 pulse-glow">
              {p.avatarUrl ? (
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  className="w-full h-full object-cover object-center"
                  onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
                />
              ) : null}
              {/* Fallback inisial — tampil jika avatarUrl null atau gambar gagal load */}
              <div
                className="w-full h-full bg-gradient-to-br from-gold/30 via-amber-500/20 to-purple-600/30 items-center justify-center"
                style={{ display: p.avatarUrl ? 'none' : 'flex' }}
              >
                <span className="font-quest text-3xl text-gold">{initials}</span>
              </div>
            </div>
            {/* Online badge */}
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-panel shadow-[0_0_8px_#10b98166]" />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Creator & Developer</p>
            <h1 className="font-quest text-2xl sm:text-3xl text-gold mb-1"
              style={{ textShadow: '0 0 20px #ffd70030' }}>
              {p.name}
            </h1>
            <p className="text-slate-300 text-sm font-semibold">{p.role}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {[
                { label: p.nim,        icon: '🎓' },
                { label: p.class,      icon: '📚' },
                { label: p.university, icon: '🏛️' },
              ].map(({ label, icon }) => (
                <span key={label} className="glass-card-light text-slate-400 text-xs rounded-full px-3 py-1 flex items-center gap-1">
                  <span>{icon}</span><span>{label}</span>
                </span>
              ))}
            </div>
            <p className="text-slate-500 text-xs italic mt-3 leading-relaxed">{p.quote}</p>
          </div>
        </div>

        {/* === ABOUT ME === */}
        <div className="glass-card rounded-2xl p-6 animate-[fadeInUp_0.5s_0.1s_ease_both]">
          <h2 className="text-slate-200 font-extrabold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>👤</span> About Me
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">{p.about}</p>
        </div>

        {/* === CONTRIBUTIONS === */}
        <div className="animate-[fadeInUp_0.5s_0.15s_ease_both]">
          <h2 className="text-slate-200 font-extrabold text-sm uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
            <span>🛠️</span> Project Contributions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {p.contributions.map((c, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 flex flex-col gap-2 hover:bg-white/5 transition-colors"
                style={{ animation: `fadeInUp 0.4s ${0.18 + i * 0.06}s ease both` }}>
                <span className="text-2xl">{c.icon}</span>
                <p className="text-slate-200 font-extrabold text-sm">{c.title}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* === SKILLS === */}
        <div className="glass-card rounded-2xl p-6 animate-[fadeInUp_0.5s_0.25s_ease_both]">
          <h2 className="text-slate-200 font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>⚡</span> Tech Skills
          </h2>
          <div className="flex flex-col gap-3">
            {p.skills.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 text-sm font-bold">{skill.name}</span>
                  <span className="text-xs font-bold" style={{ color: skill.color }}>{skill.level}%</span>
                </div>
                <div className="bg-navy rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${skill.level}%`,
                      background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`,
                      animation: `slideRight 1s ${0.3 + i * 0.1}s ease both`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === CONTACT === */}
        <div className="glass-card rounded-2xl p-6 animate-[fadeInUp_0.5s_0.3s_ease_both]">
          <h2 className="text-slate-200 font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>📬</span> Contact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '✉️',  label: 'Email',     value: p.contact.email,     href: `mailto:${p.contact.email}` },
              { icon: '🐙',  label: 'GitHub',    value: p.contact.github,    href: `https://${p.contact.github}` },
              { icon: '📸',  label: 'Instagram', value: p.contact.instagram, href: `https://instagram.com/${p.contact.instagram.replace('@','')}` },
            ].map(({ icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-light rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-white/10 hover:scale-[1.02] transition-all group"
              >
                <span className="text-lg">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">{label}</p>
                  <p className="text-slate-300 text-xs font-bold truncate group-hover:text-gold transition-colors">{value}</p>
                </div>
                <span className="text-slate-600 text-xs group-hover:text-slate-400 transition-colors">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-4 animate-[fadeInUp_0.5s_0.4s_ease_both]">
          <p className="text-slate-600 text-xs">Made with ❤️ for English Quest Final Project</p>
        </div>

      </div>
    </div>
  )
}

export default CreatorProfile
