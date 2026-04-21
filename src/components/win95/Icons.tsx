import React from "react";

type IconProps = { size?: number; className?: string };

const Img: React.FC<{ src: string; size?: number; alt?: string; className?: string }> = ({
  src,
  size = 32,
  alt = "",
  className = "",
}) => (
  <img
    src={src}
    width={size}
    height={size}
    alt={alt}
    draggable={false}
    className={`inline-block select-none ${className}`}
    style={{ imageRendering: "pixelated", width: size, height: size }}
  />
);

const ico = (file: string) => `/win95-icons/${file}.png`;

/* ---------- Shell / desktop ---------- */
export const MyComputerIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_computer_2")} size={size} alt="My Computer" />;
export const NetworkNeighborhoodIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_network_cool_two_pcs")} size={size} alt="Network Neighborhood" />;
export const RecycleBinIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_recycle_bin_empty")} size={size} alt="Recycle Bin" />;
export const RecycleBinFullIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_recycle_bin_full")} size={size} alt="Recycle Bin (full)" />;
export const InboxIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_mailbox_world")} size={size} alt="Inbox" />;

/* ---------- Folders / docs ---------- */
export const FolderIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_directory_closed")} size={size} alt="Folder" />;
export const FolderOpenIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_directory_open_network")} size={size} alt="Open folder" />;
export const SmallFolderIcon = ({ size = 16 }: IconProps) => <FolderIcon size={size} />;
export const ProgramGroupIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_directory_program_group")} size={size} alt="Program group" />;
export const MyDocumentsIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_directory_open_file_mydocs")} size={size} alt="My Documents" />;

/* ---------- Apps ---------- */
export const NotepadIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_notepad")} size={size} alt="Notepad" />;
export const WordPadIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_write_wordpad")} size={size} alt="WordPad" />;
export const IEIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_msie1")} size={size} alt="Internet Explorer" />;
export const MinesweeperIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_minesweeper")} size={size} alt="Minesweeper" />;
export const SolitaireIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_game_solitaire")} size={size} alt="Solitaire" />;
export const PaintIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_paint")} size={size} alt="Paint" />;
export const CalculatorIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_calculator")} size={size} alt="Calculator" />;
export const MsDosIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_ms-dos")} size={size} alt="MS-DOS Prompt" />;
export const CdPlayerIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_media_player")} size={size} alt="CD Player" />;
export const BriefcaseIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_executable")} size={size} alt="Briefcase" />;

export const StartFlagIcon = ({ size = 16 }: IconProps) => <Img src={ico("w98_windows")} size={size} alt="Windows" />;
export const QuestionDocIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_help_question_mark")} size={size} alt="Help" />;
export const HelpIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_help_book_cool")} size={size} alt="Help" />;
export const SettingsIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_settings_gear_cool")} size={size} alt="Settings" />;
export const FindIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_magnifying_glass")} size={size} alt="Find" />;
export const RunIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_application_hourglass")} size={size} alt="Run" />;
export const ProgramsIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_directory_program_group_cool")} size={size} alt="Programs" />;
export const DocumentsStartIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_directory_open_file_mydocs")} size={size} alt="Documents" />;
export const ShutDownIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_shut_down_normal")} size={size} alt="Shut Down" />;
export const SpeakerIcon = ({ size = 16 }: IconProps) => <Img src={ico("w98_loudspeaker_rays")} size={size} alt="Volume" />;

/* ---------- Drives / hardware ---------- */
export const HardDriveIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_hard_disk_drive")} size={size} alt="Hard drive" />;
export const FloppyIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_floppy_drive_3-5")} size={size} alt="Floppy" />;
export const CdDriveIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_cd_drive")} size={size} alt="CD-ROM drive" />;
export const AudioCdIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_cd_audio_cd")} size={size} alt="Audio CD" />;
export const PrintersIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_directory_printer")} size={size} alt="Printers" />;
export const DialUpIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_directory_dial-up_networking")} size={size} alt="Dial-up Networking" />;
export const ControlPanelIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_directory_control_panel_cool")} size={size} alt="Control Panel" />;
export const EntireNetworkIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_entire_network_globe")} size={size} alt="Entire Network" />;
export const DocumentIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_document")} size={size} alt="Document" />;

/* ---------- Control Panel applets ---------- */
export const AccessibilityIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_accessibility")} size={size} alt="Accessibility" />;
export const AddHardwareIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_hardware")} size={size} alt="Add New Hardware" />;
export const AddRemoveIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_appwizard")} size={size} alt="Add/Remove Programs" />;
export const DateTimeIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_time_and_date")} size={size} alt="Date/Time" />;
export const DisplayIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_display_properties")} size={size} alt="Display" />;
export const FontsIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_directory_fonts")} size={size} alt="Fonts" />;
export const InternetCplIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_internet_options")} size={size} alt="Internet" />;
export const JoystickIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_joystick")} size={size} alt="Joystick" />;
export const KeyboardIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_keyboard")} size={size} alt="Keyboard" />;
export const MailCplIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_envelope_closed")} size={size} alt="Mail" />;
export const ModemsIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_modem")} size={size} alt="Modems" />;
export const MouseIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_mouse")} size={size} alt="Mouse" />;
export const MultimediaIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_multimedia")} size={size} alt="Multimedia" />;
export const NetworkCplIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_network_three_pcs")} size={size} alt="Network" />;
export const PasswordsIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_keys")} size={size} alt="Passwords" />;
export const PowerIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_power_management")} size={size} alt="Power" />;
export const RegionalIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_world")} size={size} alt="Regional Settings" />;
export const SoundsCplIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_computer_sound")} size={size} alt="Sounds" />;
export const SystemIcon = ({ size = 32 }: IconProps) => <Img src={ico("w98_computer")} size={size} alt="System" />;
