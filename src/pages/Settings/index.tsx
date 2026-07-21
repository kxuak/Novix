import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { useTheme } from "../../context/ThemeContext";
import { useUser } from "../../context/UserContext";

/* ===== Ícone via máscara (mesmo padrão usado na Home) ===== */

const MaskIcon = ({
  src,
  color = "currentColor",
  size = 20,
}: {
  src: string;
  color?: string;
  size?: number;
}) => (
  <span
    className="mask-icon"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
    }}
  />
);

const PLAN_OPTIONS = ["Plano free", "Plano premium"];

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user, updateProfile, setPlan, setLanguage } = useUser();
  const navigate = useNavigate();

  /* ---------- Perfil ---------- */
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // TODO: quando o backend existir, troque isso por uma chamada
    // PATCH /me e só atualize o contexto com a resposta do servidor.
    updateProfile({ name: name.trim(), email: email.trim() });

    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleChangePlan = () => {
    // TODO: aqui entra o fluxo real de billing (checkout/assinatura)
    // quando o backend e o sistema de pagamentos existirem.
    const nextIndex = (PLAN_OPTIONS.indexOf(user.plan) + 1) % PLAN_OPTIONS.length;
    setPlan(PLAN_OPTIONS[nextIndex]);
  };

  /* ---------- Segurança ---------- */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: "error", text: "Preencha todos os campos." });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "A nova senha precisa ter ao menos 6 caracteres." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "As senhas não coincidem." });
      return;
    }

    // TODO: substituir por uma chamada real de autenticação
    // (ex: POST /me/password) quando o backend existir.
    setPasswordMessage({ type: "success", text: "Senha atualizada com sucesso." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  /* ---------- Sistema ---------- */
  const handleLogout = () => {
    // TODO: quando o login existir, limpar sessão/token real aqui
    // antes de redirecionar.
    navigate("/");
  };

  return (
    <div className="main-settings">
      <h2 className="subtitle-settings">Sistema</h2>
      <h1 className="title-settings">Personalizar configurações</h1>

      <div className="settings-grid-top">
        {/* ===== PERFIL ===== */}
        <div className="settings-panel">
          <div className="settings-panel-header">
            <div className="settings-panel-icon settings-icon-teal">
              <MaskIcon src="/user.svg" color="#00AEC5" size={20} />
            </div>
            <div>
              <h4>Perfil</h4>
              <p>Gerencie suas informações pessoais</p>
            </div>
          </div>

          <form className="perfil-body" onSubmit={handleSaveProfile}>
            <div className="perfil-avatar-col">
              <div className="perfil-avatar">
                <MaskIcon src="/user.svg" color="#fff" size={40} />
                <button type="button" className="perfil-avatar-edit" title="Em breve">
                  <MaskIcon src="/pencil.svg" color="#fff" size={14} />
                </button>
              </div>

              <div className="perfil-plan-info">
                <span className="perfil-plan-label">Plano atual</span>
                <span className="perfil-plan-badge">{user.plan}</span>
              </div>
            </div>

            <div className="perfil-fields">
              <label>
                Nome
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </label>

              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>

              <div className="perfil-actions">
                <button type="button" className="settings-btn-outline" onClick={handleChangePlan}>
                  Mudar plano
                </button>
                <button type="submit" className="settings-btn-primary">
                  {profileSaved ? "Salvo!" : "Salvar alterações"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ===== SEGURANÇA ===== */}
        <div className="settings-panel">
          <div className="settings-panel-header">
            <div className="settings-panel-icon settings-icon-green">
              <MaskIcon src="/shield-lock.svg" color="#3DE600" size={20} />
            </div>
            <div>
              <h4>Segurança</h4>
              <p>Gerencie a senha da sua conta</p>
            </div>
          </div>

          <form className="security-body" onSubmit={handleChangePassword}>
            <label>
              Senha atual
              <input
                type="password"
                placeholder="••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>

            <div className="security-row">
              <label>
                Nova senha
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>

              <label>
                Confirmar nova senha
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </div>

            {passwordMessage && (
              <p className={`security-message security-message-${passwordMessage.type}`}>
                {passwordMessage.text}
              </p>
            )}

            <div className="security-actions">
              <button type="submit" className="settings-btn-success">
                <MaskIcon src="/lock.svg" color="#3DE600" size={16} /> Alterar senha
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="settings-grid-bottom">
        {/* ===== APARÊNCIA ===== */}
        <div className="settings-panel">
          <div className="settings-panel-header">
            <div className="settings-panel-icon settings-icon-purple">
              <MaskIcon src="/brush.svg" color="#953BEA" size={20} />
            </div>
            <div>
              <h4>Aparência</h4>
              <p>Personalize do seu jeito</p>
            </div>
          </div>

          <div className="theme-picker">
            <h3>Tema</h3>
            <p>Escolha o tema do seu Novix</p>

            <div className="theme-options">
              <button
                type="button"
                className={`theme-option ${theme === "dark" ? "selected" : ""}`}
                onClick={() => setTheme("dark")}
              >
                <MaskIcon src="/moon.svg" color="currentColor" size={16} /> Escuro
              </button>

              <button
                type="button"
                className={`theme-option ${theme === "light" ? "selected" : ""}`}
                onClick={() => setTheme("light")}
              >
                <MaskIcon src="/sun.svg" color="currentColor" size={16} /> Claro
              </button>
            </div>
          </div>
        </div>

        {/* ===== SISTEMA ===== */}
        <div className="settings-panel">
          <div className="settings-panel-header">
            <div className="settings-panel-icon settings-icon-gray">
              <MaskIcon src="/settings.svg" color="var(--text-primary)" size={20} />
            </div>
            <div>
              <h4>Sistema</h4>
              <p>Configurações do sistema</p>
            </div>
          </div>

          <div className="system-body">
            <label>
              Idioma
              <div className="settings-select-wrapper">
                <select value={user.language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US" disabled>
                    English (em breve)
                  </option>
                  <option value="es-ES" disabled>
                    Español (em breve)
                  </option>
                </select>
              </div>
            </label>

            <div className="logout-row">
              <span>
                Logout de
                <br />
                dispositivo:
              </span>
              <button type="button" className="settings-btn-danger" onClick={handleLogout}>
                Desconectar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
