/*
 * DV Trainer — Study Card Dataset
 * All content derived strictly from the four DeltaV manuals in this folder:
 *   fb2004 : DeltaV Function Block Reference (D800018X012, 2004)
 *   pid    : DeltaV Proportional-Integral-Derivative (PID) Function Block notes
 *   fbref  : DeltaV Function Block Reference (D800018X052, 2005-2008)
 *   impl   : DeltaV Implementation I - Using DeltaV Operate (Course 7009, v15.LTS)
 *
 * scope: 'function-block' covers fb2004 + pid + fbref ; 'implementation' covers impl.
 * level: 'beginner' | 'intermediate' | 'expert'
 *
 * To extend: add manuals to DV_MANUALS and append card objects to DV_CARDS.
 */

const DV_MANUALS = {
  fb2004: { name: "DeltaV Function Block Reference (2004)", short: "FB Ref '04", scope: "function-block" },
  pid:    { name: "DeltaV PID Function Block",              short: "PID",         scope: "function-block" },
  fbref:  { name: "DeltaV Function Block Reference (2005-2008)", short: "FB Ref",  scope: "function-block" },
  impl:   { name: "DeltaV Implementation I — Using DeltaV Operate (7009)", short: "Impl I", scope: "implementation" },
  live:   { name: "DeltaV Live Training", short: "Live", scope: "implementation" }
};

const DV_CARDS = [
  /* ============================================================
   * FUNCTION BLOCKS — GENERAL CONCEPTS
   * ============================================================ */
  { manual: "fbref", topic: "Fundamentals", level: "beginner",
    front: "What is a function block in DeltaV?",
    back: "A function block is a self-contained algorithm (such as AI, PID, or AO) that performs a specific control or calculation task. Blocks are wired together inside a module to build a control strategy. Each block processes inputs and produces outputs every time it executes." },

  { manual: "fbref", topic: "Fundamentals", level: "beginner",
    front: "What is the block scan rate?",
    back: "The block scan rate lets blocks execute at different rates within the same module by skipping scans. Default is 1 (a 1:1 ratio — the block executes every module scan). A scan rate of 3 means a 1:3 ratio (executes every third scan). It effectively multiplies the module scan rate." },

  { manual: "fbref", topic: "Fundamentals", level: "intermediate",
    front: "If a module scans every 1 second and a block's scan rate is set to 5, how often does the block execute?",
    back: "Every 5 seconds. The block skips four module scans and executes on the fifth. This is useful for cascade control: combine both loops in one module as long as the outer loop's scan rate is a multiple of the inner loop's." },

  { manual: "fbref", topic: "Fundamentals", level: "intermediate",
    front: "What is an extensible block/parameter?",
    back: "An extensible parameter lets you add inputs/outputs to a block instead of chaining multiple blocks. For example, you can extend an ADD block to wire up to 16 values into a single block rather than joining many ADD blocks together." },

  { manual: "fbref", topic: "Composites", level: "intermediate",
    front: "What is a function block composite?",
    back: "A composite is a group of function blocks that work together as a reusable algorithm — similar to a subroutine. You build it once, store it in the Function Block Library, and reuse it across loops and applications." },

  { manual: "fbref", topic: "Composites", level: "expert",
    front: "What does the PT_COMP composite template do?",
    back: "PT_COMP compensates a measured flow based on measured pressure and/or temperature, for gas or liquid streams (differential-pressure or mass flowmeter). Inputs: measured flow, pressure, temperature; output: compensated flow (status = that of measured flow). If pressure/temperature status is not Good, the reference (calibration) value is used, disabling that compensation term. For a differential-pressure flowmeter the compensation factor is the square root of the standard equation." },

  /* ---- MODES ---- */
  { manual: "fb2004", topic: "Modes", level: "beginner",
    front: "What does the Auto (Automatic) mode do?",
    back: "In Auto, the control algorithm of the block is active and uses an operator-entered setpoint to determine the block output." },

  { manual: "fb2004", topic: "Modes", level: "beginner",
    front: "What does Manual (Man) mode do?",
    back: "In Manual mode the block output is set directly by the operator (or by logic external to the block); the control algorithm does not determine the output." },

  { manual: "fb2004", topic: "Modes", level: "beginner",
    front: "What does Out of Service (OOS) mode mean?",
    back: "In OOS the block algorithm is not active. The output is maintained at its last value or a specified failure-action value. OOS is always a permitted mode." },

  { manual: "fbref", topic: "Modes", level: "intermediate",
    front: "What is Cascade (Cas) mode?",
    back: "Cas is like Auto except the setpoint is supplied by another function block through the CAS_IN parameter. The block maintains a back-calculation value (BKCAL_OUT) to provide bumpless mode transfer when the mode changes." },

  { manual: "fbref", topic: "Modes", level: "intermediate",
    front: "What is Remote Cascade (RCas) mode?",
    back: "RCas is like Cas except the setpoint is supplied by an external control program through RCAS_IN. The block maintains a back-calculation value (RCAS_OUT) for bumpless transfer." },

  { manual: "fbref", topic: "Modes", level: "intermediate",
    front: "What is Remote Out (ROut) mode?",
    back: "ROut is like Man except the OUT value is supplied by an external control program through ROUT_IN rather than by the operator. The block maintains ROUT_OUT for bumpless transfer." },

  { manual: "fbref", topic: "Modes", level: "expert",
    front: "What is Initialization Manual (IMan) mode and when does it occur?",
    back: "IMan is applied to the upstream block of a cascade pair when its downstream partner is in a non-cascade mode. It prevents the upstream block from closing the cascade. IMan is never a permitted target mode — it means the block is tracking downstream operation. When the downstream block returns to Cas/RCas, the upstream block leaves IMan and returns to its target mode." },

  { manual: "fbref", topic: "Modes", level: "expert",
    front: "What is Local Override (LO) mode?",
    back: "LO is entered when tracking is activated: the output is driven to a value other than that produced by normal execution. For a control block the output tracks a specific input (triggered by a discrete track switch); for an output block, failure action initiates. LO is never a permitted target mode; when tracking deactivates, the block returns to its target mode." },

  { manual: "fbref", topic: "Modes", level: "intermediate",
    front: "Distinguish Target, Actual, Permitted, and Normal mode fields.",
    back: "Target = the mode the block is trying to attain (what the operator sets). Actual = the current operating mode. Permitted = the modes allowed as targets (write service blocks non-permitted targets; configurable per block). Normal = the correct/expected mode for most plant operation, set during configuration." },

  { manual: "fbref", topic: "Modes", level: "expert",
    front: "In what priority order are function block modes ranked?",
    back: "Listed in inverse priority: RCas, ROut, Cas, Auto, Man, IMan, LO, OOS — higher modes in the list have lower priority. Modes have priority, and a block climbs/sheds through this path (e.g., to reach RCas from Man it passes through Auto)." },

  { manual: "fbref", topic: "Modes", level: "expert",
    front: "What does the SHED_OPT parameter control?",
    back: "SHED_OPT (a named-set parameter) determines how a block sheds from or climbs to a remote mode on a remote-cascade connection failure. A block climbs and sheds through the same path. Options are grouped as 'Shed With Return' (keeps trying to restore remote cascade) and 'Shed With No Return' (changes the target mode, no restore attempt), each with Normal / Retained Target / Auto / Man variants." },

  { manual: "fbref", topic: "Modes", level: "expert",
    front: "How does DeltaV handle the 'Retained Target' shed option?",
    back: "DeltaV does not support Retained Target shed. Regardless of block location, the retained-target bits are turned off and the block sheds to Auto. Devices that do not support retained-target operation ignore those bits." },

  { manual: "fbref", topic: "Modes", level: "expert",
    front: "What two rules constrain mode-shed logic when SHED_OPT calls for a non-permitted mode?",
    back: "1) Shed logic never results in a non-permitted target mode. 2) Shed logic never attempts to attain an actual mode of Auto or Cas if that mode is not permitted." },

  /* ---- CASCADE ---- */
  { manual: "fbref", topic: "Cascade", level: "intermediate",
    front: "In a cascade, what are the master and slave, and what is back calculation?",
    back: "A cascade is two-way communication. The master (driving) block provides an output used as the slave's cascade input. The slave provides a back-calculation output telling the master when its output is accepted and what limit conditions exist below it; the master reads this through its back-calculation input. Each cascade mode has at least one cascade input and one back-calc output." },

  { manual: "fbref", topic: "Cascade", level: "expert",
    front: "Describe the IR/IA cascade handshake.",
    back: "When the slave's target is set to a cascade mode, its back-calc output is set with substatus Initialization Requested (IR). Seeing IR at its back-calc input, the master sets Initialization Acknowledge (IA) in its output substatus. The combination of IR (slave back-calc out) and IA (slave cascade in) triggers the slave to change actual mode to cascade. Applies to Cas, RCas, and ROut." },

  { manual: "fbref", topic: "Cascade", level: "expert",
    front: "What is the exception to the normal cascade handshake?",
    back: "When CAS_IN (or CAS_IN_D) has a NonCascade substatus — i.e., no master control block gives GoodCascade but a parameter/calculation block gives GoodNonCascade — the receiving block does not need to see IA. If target mode is Cas and the CAS_IN status is GoodNonCascade (and nothing else prevents climbing), actual mode changes to Cas immediately." },

  /* ---- STATUS ---- */
  { manual: "fb2004", topic: "Status", level: "beginner",
    front: "What is the initial status of function block outputs after a download?",
    back: "Bad. Status then propagates from input to output as the block executes." },

  { manual: "fbref", topic: "Status", level: "intermediate",
    front: "What are the three broad quality categories of a function block status?",
    back: "Good, Bad, and Uncertain. Status is carried on signals (with substatus and limit information) and propagates from a block's inputs to its outputs to indicate the trustworthiness of a value." },

  /* ---- PARAMETERS ---- */
  { manual: "fbref", topic: "Parameters", level: "intermediate",
    front: "What are the main function block parameter reference types?",
    back: "Dynamic Reference, External Reference, and Internal Reference parameters. Each has an associated verification step to confirm the reference resolves correctly (Verifying Dynamic/External/Internal References)." },

  { manual: "fbref", topic: "Parameters", level: "intermediate",
    front: "What is a named-set parameter?",
    back: "A named-set parameter holds one value selected from a defined set of named choices (an enumeration), e.g., SHED_OPT. It presents human-readable names instead of raw numbers." },

  { manual: "fbref", topic: "Parameters", level: "expert",
    front: "What is an option bitstring parameter, and name several option groups.",
    back: "A bitstring parameter where each bit enables an option. Groups include Control Options, I/O Options, Status Options, Integration Options, Device Options, Algorithm Options, Input Options, and FRSI Add-On Options." },

  { manual: "fbref", topic: "Parameters", level: "intermediate",
    front: "What is a conditional alarming parameter?",
    back: "Conditional alarming parameters allow alarms to be enabled/evaluated only under defined conditions, so alarms are suppressed or activated depending on process state rather than always active." },

  /* ============================================================
   * I/O BLOCKS
   * ============================================================ */
  { manual: "fb2004", topic: "I/O Blocks", level: "beginner",
    front: "What does the Analog Input (AI) function block do?",
    back: "The AI block takes the input from a measurement device (via a channel), converts and scales it into engineering units, and makes it available to other blocks. It supports mode control, alarm detection, and signal status propagation." },

  { manual: "fbref", topic: "I/O Blocks", level: "intermediate",
    front: "What modes does the Analog Input (AI) function block support?",
    back: "Out of Service (OOS), Manual (Man), and Automatic (Auto)." },

  { manual: "fbref", topic: "I/O Blocks", level: "expert",
    front: "How is the channel input status to the AI block affected by limiting at the I/O card?",
    back: "The channel input status to the AI block is set high- or low-limited by the input card when the channel value reaches a limit, and that limit status propagates through the block's output." },

  { manual: "fb2004", topic: "I/O Blocks", level: "beginner",
    front: "What does the Analog Output (AO) function block do?",
    back: "The AO block converts a control signal into a form suitable for a field device output channel (e.g., a valve), performing output channel processing. It supports cascade connection so a controller like PID can drive it." },

  { manual: "fbref", topic: "I/O Blocks", level: "intermediate",
    front: "What modes does the Analog Output (AO) function block support?",
    back: "Initialization Manual (IMan), Out of Service (OOS), Local Override (LO, fieldbus only), Manual (Man), Automatic (Auto), Cascade (Cas), and Remote Cascade (RCas)." },

  { manual: "fb2004", topic: "I/O Blocks", level: "beginner",
    front: "What does the Discrete Input (DI) function block do?",
    back: "The DI block reads a discrete (on/off) field signal through a channel, applies processing (such as inversion and alarm detection), and makes the discrete value available to the strategy." },

  { manual: "fbref", topic: "I/O Blocks", level: "intermediate",
    front: "What modes does the Discrete Input (DI) block support?",
    back: "Out of Service (OOS), Manual (Man), and Automatic (Auto)." },

  { manual: "fb2004", topic: "I/O Blocks", level: "beginner",
    front: "What does the Discrete Output (DO) function block do?",
    back: "The DO block drives a discrete field output (such as a solenoid or motor) from a discrete control signal, supporting cascade connection, mode control, and status handling." },

  { manual: "fbref", topic: "I/O Blocks", level: "intermediate",
    front: "What modes does the Discrete Output (DO) block support?",
    back: "Initialization Manual (IMan), Out of Service (OOS), Local Override (LO, fieldbus only), Manual (Man), Automatic (Auto), Cascade (Cas), and Remote Cascade (RCas, fieldbus only)." },

  { manual: "fbref", topic: "I/O Blocks", level: "intermediate",
    front: "What does the Alarm Detection function block provide?",
    back: "It provides the ability to easily specify alarms on parameters obtained from other blocks. For example, if the OUT value from a Subtraction block goes outside the limits set in the Alarm Detection block, an alarm triggers." },

  { manual: "fbref", topic: "I/O Blocks", level: "expert",
    front: "What is the H1 Carrier Multiple Discrete Input (FFMDI) block used for?",
    back: "It brings multiple discrete inputs from an H1 FOUNDATION Fieldbus carrier device into DeltaV as a group. (A separate FFMDI_STD variant is the standard Fieldbus Multiple Discrete Input.) It supports OOS, Man, and Auto modes." },

  { manual: "fbref", topic: "I/O Blocks", level: "expert",
    front: "What is the Multiplexed Analog Input (FFMAI_RMT) block used for?",
    back: "It provides multiplexed analog inputs from a remote Fieldbus source, bringing several analog values in through one block. It supports OOS, Man, and Auto modes." },

  { manual: "fbref", topic: "I/O Blocks", level: "intermediate",
    front: "What does the Pulse Input (PIN) function block do?",
    back: "The PIN block processes a pulse-frequency input (such as from a flow meter that outputs pulses), converting the pulse rate into an engineering-units value, with mode control and alarm handling." },

  /* ============================================================
   * ANALOG CONTROL BLOCKS
   * ============================================================ */
  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "What is the Bias/Gain function block typically used for?",
    back: "It applies a bias and/or gain to a signal. It is often used as a slave to a Splitter block, which in turn is a slave to the upstream controller. It supports seven modes (OOS, IMan, LO, Man, Auto, Cas, RCas)." },

  { manual: "fbref", topic: "Analog Control", level: "expert",
    front: "What does the Calculation/Logic function block do?",
    back: "It uses as many as 16 inputs and 16 outputs to evaluate a contained expression, and it supports IF-THEN-ELSE-END_IF structures for logical/mathematical calculations within a module." },

  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "What is the Control Selector function block ideal for?",
    back: "Providing automatic override control. It can take multiple control inputs and select among them (e.g., high/low/middle selection) so one loop overrides another based on process conditions. It supports OOS, IMan, Man, and Auto modes." },

  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "What does the Deadtime function block do?",
    back: "It delays a signal by a configured dead time (transport delay), reproducing the input at the output after the specified time. It supports OOS, Man, and Auto modes." },

  { manual: "fb2004", topic: "Analog Control", level: "intermediate",
    front: "What algorithm does the Filter function block use and what does it accomplish?",
    back: "It executes a first-order lag algorithm (a low-pass filter) to filter out high-frequency noise, smoothing changes in an input signal." },

  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "What does the Input Selector function block do?",
    back: "It is a mathematical and logical input calculation block that chooses an output from among its inputs (for example first-good, max, min, middle, or average selection)." },

  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "Name two typical applications of the Lead/Lag function block.",
    back: "The Lead/Lag block is useful for a variety of process control applications; two typical uses are feedforward control dynamic compensation and setpoint/signal shaping. It applies lead and lag time constants to a signal." },

  { manual: "fb2004", topic: "Analog Control", level: "intermediate",
    front: "What does the Limit function block do?",
    back: "It restricts an output between configured high and low limits (e.g., OUT_HI_LIM and OUT_LO_LIM), clamping the signal so it cannot exceed those bounds, and propagates limit status." },

  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "What does the Manual Loader function block allow?",
    back: "It allows an operator to control devices directly by setting the block output. It supports four modes (OOS, IMan, LO, Man)." },

  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "What does the Ramp function block do?",
    back: "It generates a ramping setpoint for a control loop, letting you change a setpoint gradually at a controlled rate rather than in a step." },

  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "What does the Rate Limit function block do?",
    back: "It keeps a controlled variable from changing too quickly, limiting the rate of change of a signal to protect the process from abrupt moves." },

  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "What features does the Ratio function block support?",
    back: "The Ratio block supports signal filtering, mode control, output tracking, and alarm detection. It scales one flow/variable relative to another to maintain a configured ratio, and supports multiple modes." },

  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "How does the Scaler function block compute its output, and does it have modes?",
    back: "It uses the input value, input range, and output range to compute the scaled output value. It supports signal status propagation but has no modes or alarm detection." },

  { manual: "fbref", topic: "Analog Control", level: "expert",
    front: "What does the Signal Characterizer function block do?",
    back: "It correlates input IN_1 to output OUT_1 and input IN_2 to output OUT_2 using a configured curve (characterization). It supports signal status propagation and two modes, with no standard alarms." },

  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "What does the Signal Generator function block generate?",
    back: "It generates sine wave, square wave, and random signal components. The random output is a value between -200 and 200, useful for testing/tuning." },

  { manual: "fbref", topic: "Analog Control", level: "intermediate",
    front: "How many inputs can the Signal Selector function block read?",
    back: "As many as sixteen inputs (the number of inputs is extensible). It reads their values and statuses and selects an output based on the configured selection method." },

  { manual: "fbref", topic: "Analog Control", level: "expert",
    front: "What is the Splitter function block designed to do?",
    back: "It splits one controller output to two downstream blocks and is designed to combine the limit information from those two downstream blocks into limits passed back to the upstream block. It supports mode control and signal status propagation, with no standard alarms." },

  /* ============================================================
   * PID FUNCTION BLOCK
   * ============================================================ */
  { manual: "pid", topic: "PID", level: "beginner",
    front: "What control does the PID function block provide?",
    back: "Proportional (P) + Integral (I) + Derivative (D) control. It combines the logic to perform analog input channel processing, PID control (with optional nonlinear control), and analog output channel processing. It can run in the DeltaV controller or execute in a Fieldbus device." },

  { manual: "pid", topic: "PID", level: "beginner",
    front: "Besides the compensating algorithm, name capabilities the PID block adds for practical control.",
    back: "Running control in manual, anti-reset windup, output limits, bumpless manual-to-automatic transfers, and the ability to implement cascade and feedforward control. It also supports mode control, signal scaling and limiting, override tracking, alarm limit detection, signal status propagation, and simulation." },

  { manual: "pid", topic: "PID", level: "intermediate",
    front: "What two PID equation forms does the block support, and what do both support?",
    back: "The Standard form and the Series form. Both are discrete implementations and both support external reset and feedforward." },

  { manual: "pid", topic: "PID", level: "expert",
    front: "In the PID equation, what do STRUCTURE, BETA, and GAMMA determine?",
    back: "STRUCTURE together with BETA determines P(s) — the variable to which proportional action is applied (BETA sets the weighting of proportional action on a setpoint change). STRUCTURE together with GAMMA determines D(s) — the variable to which derivative action is applied (GAMMA sets the weighting of derivative action on a setpoint change)." },

  { manual: "pid", topic: "PID", level: "expert",
    front: "In the PID equation, what are Tr, Td, and L(s)?",
    back: "Tr = reset time (parameter RESET) in seconds. Td = derivative time (parameter RATE) in seconds. L(s) = the external reset input, taken from either BKCAL_IN or OUT." },

  { manual: "pid", topic: "PID", level: "expert",
    front: "What is KNL (nonlinear gain) in the PID block, and where is it applied?",
    back: "KNL is a nonlinear gain applied to the P + I terms but NOT to the D term. Nonlinear action is activated in FRSIPID_OPTS by selecting Use_Nonlinear_Gain_Modification (supporting error-squared and notched-gain control)." },

  { manual: "pid", topic: "PID", level: "expert",
    front: "Why must the PID GAIN parameter be scaled, and what is GAINa?",
    back: "Because DeltaV works in engineering units, the GAIN parameter must be scaled to preserve the meaning of the normalized gain. GAINa is the normalized gain obtained after scaling GAIN from PV range to OUT range." },

  { manual: "pid", topic: "PID", level: "intermediate",
    front: "What is the sign convention for direct vs reverse acting PID, and what parameter sets it?",
    back: "In the equation the ± term is + for reverse acting and − for direct acting. Direct_Acting is selected in CONTROL_OPTS. E(s) is the error (SP − PV)." },

  { manual: "pid", topic: "PID", level: "beginner",
    front: "How does an operator interact with a PID controller in DeltaV?",
    back: "Through a controller 'faceplate' — the DeltaV controller faceplate that shows PV, SP, OUT, and mode, allowing the operator to change mode, setpoint, and output." },

  { manual: "fbref", topic: "PID", level: "intermediate",
    front: "What modes does the PID function block support?",
    back: "Out of Service (OOS), Initialization Manual (IMan), Local Override (LO), Manual (Man), Automatic (Auto), Cascade (Cas), Remote Cascade (RCas), and Remote Out (ROut)." },

  { manual: "fbref", topic: "PID", level: "expert",
    front: "What two anti-windup / reset methods can the PID block use?",
    back: "A selection between clamped integral action and dynamic reset limiting (external-reset feedback). The reset component is implemented with a positive-feedback network, which enables external reset and prevents reset windup when the output is limited or the cascade is open." },

  { manual: "fbref", topic: "PID", level: "expert",
    front: "What is BKCAL communication used for with the PID block?",
    back: "BKCAL (back calculation) communication passes the downstream block's output and limit status back to the PID's BKCAL_IN so the PID can initialize its reset, provide bumpless transfers, and prevent windup when the downstream path is limited or open (the Advanced Topics - BKCAL Communications subject)." },

  /* ============================================================
   * MATH BLOCKS
   * ============================================================ */
  { manual: "fb2004", topic: "Math Blocks", level: "beginner",
    front: "What does the Absolute Value (ABS) function block do?",
    back: "It provides the absolute value of an integer or floating-point input value." },

  { manual: "fb2004", topic: "Math Blocks", level: "beginner",
    front: "What does the Add function block do, and how many inputs can it take?",
    back: "It sums multiple inputs (e.g., to compute a total). The number of inputs is extensible — the default is two inputs and you can add more (up to 16)." },

  { manual: "fbref", topic: "Math Blocks", level: "expert",
    front: "What does the Arithmetic function block provide?",
    back: "It provides range extension and compensation for a primary input through nine arithmetic types, letting you configure a range-extension/compensation function (e.g., flow compensation)." },

  { manual: "fbref", topic: "Math Blocks", level: "intermediate",
    front: "What does the Comparator function block do?",
    back: "It takes the DISC_VAL input and performs a compare operation against COMP_VAL1 (and COMP_VAL2), producing discrete outputs based on the comparison result." },

  { manual: "fbref", topic: "Math Blocks", level: "beginner",
    front: "What is the Divide function block useful for?",
    back: "Conversion calculations — it divides one input by another." },

  { manual: "fbref", topic: "Math Blocks", level: "intermediate",
    front: "What is the Integrator function block useful for?",
    back: "Calculating total flow, total mass, or volume over time by integrating a rate input; it can also be used for totalizing applications." },

  { manual: "fbref", topic: "Math Blocks", level: "beginner",
    front: "What does the Multiply function block do?",
    back: "It multiplies all input signals connected to the block and places the result at the output. The number of inputs is extensible (default two)." },

  { manual: "fb2004", topic: "Math Blocks", level: "beginner",
    front: "What does the Subtract function block do?",
    back: "It is a mathematical operator that subtracts one input from another, often used with other Math function blocks." },

  /* ============================================================
   * TIMER / COUNTER BLOCKS
   * ============================================================ */
  { manual: "fbref", topic: "Timer/Counter", level: "intermediate",
    front: "Does the Counter function block have modes or alarms?",
    back: "No. The Counter block supports signal status propagation but has no modes or alarm detection. It counts discrete transitions/events." },

  { manual: "fbref", topic: "Timer/Counter", level: "intermediate",
    front: "What does the Date Time Event (DTE) function block do?",
    back: "It generates events based on Absolute Time (local time of day). Multiple DTE blocks can be used to schedule several time-based events." },

  { manual: "fbref", topic: "Timer/Counter", level: "intermediate",
    front: "What does the Off-Delay Timer (OFFD) function block do?",
    back: "It delays the transfer of a False (0) discrete input to the output by a specified time. It immediately transfers a True input to the output, but holds the output True for the delay period after the input goes False." },

  { manual: "fbref", topic: "Timer/Counter", level: "intermediate",
    front: "What does the On-Delay Timer (OND) function block do?",
    back: "It delays the transfer of a True (1) discrete input to the output by a specified time. It immediately transfers a False input to OUT_D, but waits the delay before setting the output True." },

  { manual: "fbref", topic: "Timer/Counter", level: "intermediate",
    front: "What does the Retentive Timer (RET) function block do?",
    back: "It generates a True (1) discrete output after the input has been True for a cumulative (retained) time, remembering accumulated time across input interruptions until reset." },

  { manual: "fb2004", topic: "Timer/Counter", level: "intermediate",
    front: "What does the Timed Pulse function block do?",
    back: "It sets the output True for a specified time. For example, you can use it to run a motor for a fixed duration." },

  /* ============================================================
   * LOGICAL BLOCKS
   * ============================================================ */
  { manual: "fbref", topic: "Logical", level: "beginner",
    front: "What does the And function block do?",
    back: "It generates a discrete output based on the logical AND of two to sixteen discrete inputs (extensible), used to determine if all selected inputs are True." },

  { manual: "fbref", topic: "Logical", level: "beginner",
    front: "What does the Or function block do?",
    back: "It generates a discrete output based on the logical OR of two to sixteen discrete inputs (extensible), True when any selected input is True." },

  { manual: "fbref", topic: "Logical", level: "beginner",
    front: "What does the Not function block do?",
    back: "It generates an output that is the logical NOT of its input — when the input is False, the output is True, and vice versa." },

  { manual: "fbref", topic: "Logical", level: "intermediate",
    front: "What is the Boolean Fan Input function block useful for?",
    back: "It is useful to detect and trap one or more discrete inputs as they transition to a target state. Its number of inputs is extensible (default two)." },

  { manual: "fbref", topic: "Logical", level: "intermediate",
    front: "What does the Boolean Fan Output function block do?",
    back: "It distributes one input to multiple discrete outputs; the statuses of the block outputs (OUT_D) are set equal to the status of the block input (IN_INT). Its number of outputs is extensible." },

  { manual: "fbref", topic: "Logical", level: "intermediate",
    front: "What does the Multiplexer function block do?",
    back: "It selects one input out of a number of inputs; the input is chosen by operator action or by a selector signal." },

  { manual: "fbref", topic: "Logical", level: "intermediate",
    front: "What is the Negative Edge Trigger function block used for?",
    back: "To trigger other logical events based on the falling transition (True-to-False) of a discrete signal." },

  { manual: "fbref", topic: "Logical", level: "intermediate",
    front: "What is the Positive Edge Trigger function block used for?",
    back: "To trigger other logical events based on the rising transition (False-to-True) of a discrete signal." },

  { manual: "fbref", topic: "Logical", level: "intermediate",
    front: "What does the Transfer function block do?",
    back: "It selects one of two inputs based on the SELECTOR parameter value, passing the chosen input to the output." },

  /* ============================================================
   * ENERGY / STEAM METERING BLOCKS
   * ============================================================ */
  { manual: "fbref", topic: "Energy Metering", level: "expert",
    front: "What does the ISE steam block calculate?",
    back: "The ISE block calculates the final enthalpy for isentropic expansion of steam to a given pressure for given initial conditions." },

  { manual: "fbref", topic: "Energy Metering", level: "expert",
    front: "What does the SST steam block calculate?",
    back: "SST calculates steam enthalpy, entropy, specific volume, and pressure for saturation conditions." },

  { manual: "fbref", topic: "Energy Metering", level: "expert",
    front: "What does the TSS steam block calculate?",
    back: "TSS calculates the steam temperature at saturation for a given steam pressure." },

  { manual: "fbref", topic: "Energy Metering", level: "expert",
    front: "What does the SDR steam block calculate?",
    back: "SDR calculates the square root of the ratio of steam density to the density of steam corresponding to reference conditions (used in flow compensation)." },

  { manual: "fbref", topic: "Energy Metering", level: "expert",
    front: "What does the STM steam block calculate?",
    back: "STM calculates steam enthalpy, entropy, and specific volume for a given gauge pressure and temperature." },

  { manual: "fbref", topic: "Energy Metering", level: "expert",
    front: "What do the WTH and WTS water blocks calculate?",
    back: "WTH calculates the enthalpy of water for a specified temperature (at saturation conditions); WTS calculates the entropy of water for a specified temperature (at saturation conditions)." },

  /* ============================================================
   * ADVANCED CONTROL BLOCKS
   * ============================================================ */
  { manual: "fbref", topic: "Advanced Control", level: "expert",
    front: "What is the Fuzzy Logic Control function block designed for?",
    back: "For situations where you need less oscillation and improved control response; it is normally set up by Tune. It supports OOS, IMan, LO, Man, Auto, Cas, RCas, and ROut modes." },

  { manual: "fbref", topic: "Advanced Control", level: "expert",
    front: "What is the MPC (Model Predictive Control) function block?",
    back: "It is the basis of implementing multivariable control in a DeltaV system. Its execution rate is limited to one second or slower, and it is not supported in composites." },

  { manual: "fbref", topic: "Advanced Control", level: "expert",
    front: "What is the MPC Process Simulator block for?",
    back: "It is designed to be used with the MPC function block, providing a simulated process model to test and commission MPC control." },

  { manual: "fbref", topic: "Advanced Control", level: "expert",
    front: "How does MPCPro differ from MPC, and what modes does it add?",
    back: "MPCPro is the professional MPC block; like MPC its execution rate is limited to one second or slower and it is not supported in composites, but MPCPro adds Cascade mode (supporting OOS, IMan, Man, Auto, Local Override, and Cascade)." },

  { manual: "fbref", topic: "Advanced Control", level: "expert",
    front: "What is the Neural Network (NN) function block?",
    back: "It is the basis of implementing neural networks in a DeltaV system (for example, inferential/soft-sensor predictions). It is not supported in composites." },

  { manual: "fbref", topic: "Advanced Control", level: "expert",
    front: "What do the AVTR and DVTR function blocks provide?",
    back: "AVTR provides an analog voter function and DVTR provides a discrete voter function. A voter block monitors a number of input values and votes on them (e.g., for safety/redundant measurement logic)." },

  { manual: "fbref", topic: "Advanced Control", level: "expert",
    front: "What is the Diagnostic function block used for?",
    back: "It provides a method to monitor device alerts from non-fieldbus assets; you wire device information into it within modules to surface diagnostics." },

  /* ============================================================
   * IMPLEMENTATION I — SYSTEM ARCHITECTURE
   * ============================================================ */
  { manual: "impl", topic: "Architecture", level: "beginner",
    front: "What are the three main node types on a basic DeltaV control network?",
    back: "A Workstation, a Controller, and the network switches (Primary and Secondary switches). The controller provides communication and control between field devices and the other nodes on the control network." },

  { manual: "impl", topic: "Architecture", level: "intermediate",
    front: "List the key DeltaV system capacity maximums.",
    back: "120 Nodes, 100 Controllers (simplex or redundant pairs), 65 Workstations, 30,000 Device Signal Tags (DSTs), and 25,000 SCADA tags." },

  { manual: "impl", topic: "Architecture", level: "intermediate",
    front: "What are the per-controller DST limits for MQ/SQ, MX/SX, SZ, and PK controllers?",
    back: "750 DSTs max per MQ/SQ, 1500 per MX/SX, 1536 per SZ, and 1500 per PK controller. (The PK controller comes in sizes 100, 300, and 750.)" },

  { manual: "impl", topic: "Architecture", level: "intermediate",
    front: "Compare the M-series MQ and MX controllers.",
    back: "MQ: 48 MB user memory, 750 DSTs. MX: 96 MB user memory, 1500 DSTs. M-series controllers provide communication and control between field devices and the other network nodes." },

  { manual: "impl", topic: "Architecture", level: "intermediate",
    front: "Compare the S-series SQ, SX, and SZ controllers.",
    back: "SQ: 48 MB user memory. SX: 96 MB user memory. SZ: designed for DeltaV SIS with Electronic Marshalling. S-series hardware (silver, snap-in cards) was introduced with DeltaV v11.3." },

  { manual: "impl", topic: "Architecture", level: "expert",
    front: "What makes the DeltaV PK Controller distinctive?",
    back: "It is a single integrated controller that supports any DeltaV I/O type and executes control modules as fast as 25 ms. Local I/O support includes M-series I/O (except M-series IS I/O), S-series I/O, CHARMs I/O, Wireless I/O, M-series Zone 2 Remote I/O, and DeltaV SIS." },

  { manual: "impl", topic: "I/O Hardware", level: "beginner",
    front: "How many local I/O cards does a DeltaV controller support?",
    back: "Up to 64 local I/O cards. M-series hardware uses an 8-Wide I/O Interface Carrier with I/O terminal blocks, a controller, and a system power supply." },

  { manual: "impl", topic: "I/O Hardware", level: "intermediate",
    front: "Which bussed I/O card types does M-series support, and which can be redundant?",
    back: "FOUNDATION Fieldbus Interface*, DeviceNet, Profibus DP*, Actuator Sensor Interface (AS-i), and Serial Interface*. Those marked * (FF, Profibus DP, Serial) can be used for redundant I/O applications." },

  { manual: "impl", topic: "I/O Hardware", level: "intermediate",
    front: "What is Electronic Marshalling, and what hardware does it use?",
    back: "Electronic Marshalling uses CHARMs (CHARacterization Modules) to terminate field wiring and route any signal type to any controller electronically. Hardware includes the CHARM I/O Card (CIOC) and carrier, CHARMs, CHARM Baseplates, and CHARM terminal blocks. Max 16 CIOCs/WIOCs per controller." },

  { manual: "impl", topic: "I/O Hardware", level: "expert",
    front: "What is a CHARM, and when were CHARM classes introduced?",
    back: "A CHARM (CHARacterization Module) is a single-channel module that characterizes one field signal (analog, discrete, or IS). A variety of analog, discrete, and IS CHARMs were introduced in DeltaV v11.3.1." },

  { manual: "impl", topic: "I/O Hardware", level: "expert",
    front: "What is Distributed CHARMs and how is it structured?",
    back: "Distributed CHARMs places CHARMs closer to field devices, useful where equipment is lightly instrumented. Hardware includes the CHARM I/O Gateway (connected to a CIOC or CHARM baseplate) and the CHARM I/O Block (rugged field housing). It supports 8 drops of 12 CHARMs each." },

  { manual: "impl", topic: "I/O Hardware", level: "expert",
    front: "What does the DeltaV S-series Wireless I/O Card (WIOC) do, and what are its limits?",
    back: "The WIOC provides redundant communications between controllers and Smart Wireless Field Links, which talk to wireless field devices via the self-organizing network. Limits: 100 devices per WIOC, and 16 CIOCs/WIOCs per controller." },

  { manual: "impl", topic: "Applications", level: "beginner",
    front: "What is DeltaV Explorer used for?",
    back: "DeltaV Explorer is used to view and edit the system's configuration. It provides pull-down menus, access buttons to other DeltaV programs, and +/- symbols to expand/collapse items. Access via All apps → DeltaV Engineering → DeltaV Explorer." },

  { manual: "impl", topic: "Applications", level: "beginner",
    front: "What is DeltaV Control Studio used for?",
    back: "Control Studio is used to define and modify control modules. Access via All apps → DeltaV Engineering → Control Studio." },

  { manual: "impl", topic: "Applications", level: "beginner",
    front: "What is DeltaV Operate (Configure) used for?",
    back: "DeltaV Operate (Configure) is used to create and edit DeltaV graphics (operator displays). DeltaV Operate (Run) is the runtime operator environment." },

  { manual: "impl", topic: "Applications", level: "intermediate",
    front: "What is DeltaV Diagnostics used for and how is it accessed?",
    back: "DeltaV Diagnostics displays system diagnostic information about nodes, controllers, and I/O. Access via All apps → DeltaV Operator → Diagnostics." },

  { manual: "impl", topic: "Plant Areas", level: "intermediate",
    front: "What are the characteristics of a Plant Area?",
    back: "A Plant Area contains control modules, defines user privilege boundaries, and defines workstation alarm boundaries." },

  { manual: "impl", topic: "Plant Areas", level: "expert",
    front: "What two conditions must be met to control a plant area from a specific workstation?",
    back: "1) The user must have 'operate' privilege on that plant area. 2) The area must be assigned to the workstation's Alarms and Events subsystem. Workstations can be restricted to control only the areas assigned to their A&E subsystem." },

  { manual: "impl", topic: "DSTs", level: "beginner",
    front: "What is a Device Signal Tag (DST)?",
    back: "A DST is a named item that attaches an I/O channel to a control module. It is typically named to match the instrument name and is used to define I/O properties (e.g., Analog In vs. HART; DO Latching, Momentary, or Continuous Pulse)." },

  { manual: "impl", topic: "DSTs", level: "intermediate",
    front: "When does a device consume one DST license?",
    back: "A device uses one DST license when it is (1) wired into an I/O channel, (2) used in a function block in a control module, and (3) assigned to a controller. Start with the P&ID and count the number and type of instruments to determine required DST licensing." },

  { manual: "impl", topic: "DSTs", level: "intermediate",
    front: "How are channels/DSTs configured in DeltaV Explorer?",
    back: "Configure channels from DeltaV Explorer: CTLR → I/O → Card # (e.g., C01) → Channel # (e.g., CH01) → Properties. DST licensing is based on the number and type of I/O: Analog Output, Analog Input, Discrete Output, Discrete Input." },

  { manual: "impl", topic: "Named Sets", level: "intermediate",
    front: "What is a Named Set in DeltaV?",
    back: "A Named Set is a collection of strings called Named States with equivalent integer values from 0 to 255. You can add up to 255 names to a named set. Access via DeltaV Explorer → Setup → Named Sets. Example: Passive = 0, Active1 = 1." },

  { manual: "impl", topic: "Download", level: "intermediate",
    front: "What does a controller download transfer?",
    back: "A download transfers controller configuration, setup data, and cold restart memory from the workstation to the controller. Download subsets include configuration data not tied to a specific module/card — named sets, parameter security, cold restart information, redundancy information, and alarm data." },

  { manual: "impl", topic: "Cold Restart", level: "intermediate",
    front: "What does Cold Restart ensure, and where is it enabled?",
    back: "Cold Restart ensures that after a power failure the controller restarts automatically — without manual intervention and without any other device present on the network — by downloading itself from its cold restart memory. Enable it via CTLR → Properties → Controller tab." },

  { manual: "impl", topic: "Cold Restart", level: "expert",
    front: "What are the Cold Restart options?",
    back: "Always Disabled; Always Enabled (maximum time); and Enabled Within A Time Limit — configurable in Days (0-30), Hours (0-23), and Minutes (0-59). Commissioning and downloading run automatically if power returns within the cold restart time." },

  { manual: "impl", topic: "Alarms", level: "intermediate",
    front: "What does the Alarm Priorities Properties dialog define?",
    back: "It defines the alarm Priority's Description, Value, Auto Acknowledge New Alarms, Auto Acknowledge When Inactive, Alarm Banner shows (Not Hidden / Module / Unit-Equipment Module), Wave File, and Suppressed sound for acknowledged alarms." },

  { manual: "impl", topic: "Alarms", level: "expert",
    front: "What is a Conditional Alarm and how is it created in the course?",
    back: "A conditional alarm activates an alarm only under a defined condition (e.g., alert if temperature goes above 80°F so corrective action can be taken). The workshop generates a Difference Report and then configures the conditional alarm." },

  { manual: "impl", topic: "Graphics", level: "beginner",
    front: "What is a datalink in a DeltaV Operate picture, and how is one added?",
    back: "A datalink displays/writes a live parameter value on a graphic. Add one by clicking the Datalink Stamper button in DeltaV Operate (Configure). 'Confirm' is used to confirm the data write when an operator changes a value." },

  { manual: "impl", topic: "Graphics", level: "intermediate",
    front: "What is a Dynamo?",
    back: "A Dynamo is a group of objects that represents a device or piece of equipment (e.g., a valve, motor, or controller faceplate) as a reusable graphic element placed on operator displays." },

  { manual: "impl", topic: "Graphics", level: "intermediate",
    front: "What does the Chart Builder provide, and which parameters do Theme/High Performance dynamos support natively?",
    back: "The Chart Builder lets a user dynamically build a chart with 6 trends. Theme and High Performance dynamos natively support adding three default parameters — PV, SP, and OUT — to the Chart Builder." },

  { manual: "impl", topic: "Regulatory Control", level: "intermediate",
    front: "What does the mode of a PID block determine?",
    back: "Mode determines where the PID block gets its setpoint (SP) and how it determines its output (OUT). DeltaV function block modes include AUTO, CAS, MAN, RCAS, ROUT, IMAN, OOS, and LO." },

  { manual: "impl", topic: "Cascade Control", level: "expert",
    front: "What are the numeric target/actual values for the DeltaV modes (important for Fieldbus writes)?",
    back: "OOS = 1 (T/A). LO = 4 (Actual only). MAN = 8 (T/A). AUTO = 16 (T/A). IMAN = 2 (Actual). CAS = 48 Target / 32 Actual. RCAS = 80 Target / 64 Actual. ROUT = 144 Target / 128 Actual. Always write the numeric value, not the word, to Fieldbus devices." },

  { manual: "impl", topic: "SFC", level: "beginner",
    front: "What are Sequential Function Charts (SFCs) used for, and what do they consist of?",
    back: "SFCs control time/event sequences. They consist of Steps (execute actions), Transitions (determine when to proceed based on an expression evaluating TRUE), and Terminations (a special symbol marking the end of a sequence, which may contain an expression)." },

  { manual: "impl", topic: "SFC", level: "intermediate",
    front: "What are the three types of SFC Step Actions?",
    back: "Assignment (assigns an expression's result to a destination — the most common), Boolean (references a module-level Boolean parameter, e.g., set it TRUE), and Non-Boolean (runs a Function Block embedded inside the SFC logic)." },

  { manual: "impl", topic: "SFC", level: "expert",
    front: "What are the SFC Step Action Qualifiers (Stored vs Non-Stored)?",
    back: "Non-Stored: N (Non-Stored), R (Reset), L (Time Limited), D (Delayed), P (Pulse). Stored: S (Set/Stored), SD (Stored and Delayed), DS (Delayed and Stored), SL (Stored and Time Limited)." },

  { manual: "impl", topic: "Equipment Modules", level: "intermediate",
    front: "What is an Equipment Module (EM)?",
    back: "An EM typically provides supervisory control for a collection of control modules, coordinating the operation of multiple modules that must work together to control related equipment. EMs contain one or more modules and are typically controlled using states or commands." },

  { manual: "impl", topic: "Equipment Modules", level: "expert",
    front: "How many EM algorithm types are there, and which two are most common?",
    back: "Seven algorithm types can define EM logic. The most commonly used are the State-Driven and Command-Driven algorithms. The others are Function Block Diagram, Sequential Function Chart, Phase, Phase with command-driven run logic, and Phase with state-driven run logic." },

  { manual: "impl", topic: "Equipment Modules", level: "expert",
    front: "Contrast Command-Driven and State-Driven EM algorithms.",
    back: "Command-Driven: used when multiple steps/commands are needed to supervise control modules with timing relationships; contains SFC code based on commands. State-Driven: used when a single step/value manipulates the control modules (simple, no complex timing, e.g., changing setpoints on a group of valves/motors); contains SFC code based on states. Both associate commands/states with the A_COMMAND parameter (a Named Set), which must include a mandatory entry value 255 = undefined/idle." },

  { manual: "impl", topic: "Equipment Modules", level: "expert",
    front: "What is a Phase Algorithm in an Equipment Module?",
    back: "A Phase Algorithm contains an S88 state-transition diagram made up of embedded composites that hold the logic governing transitions between the states of a phase. Variants replace the Run-logic composite with command-driven or state-driven logic." },

  { manual: "impl", topic: "Continuous Historian", level: "intermediate",
    front: "What does the DeltaV Continuous Historian do?",
    back: "It collects user-specified parameters for long-term storage. Components: History Collection (define module/node parameters to monitor and store), Continuous History Subsystems (each workstation has one; monitors modules for history on a plant-area basis), and Process History View (displays real-time and historical data)." },

  { manual: "impl", topic: "Continuous Historian", level: "expert",
    front: "What is an embedded trend, and how is it added/configured?",
    back: "An embedded trend object is placed in a graphic display using the Embedded Trend Control button in the DeltaV Toolbox. Double-click it in Configure mode to configure the chart; right-click it in Run mode for many of the same options as Process History View." },

  { manual: "impl", topic: "Motor Control", level: "intermediate",
    front: "In the course, how is a motor represented and what block type is typically used?",
    back: "Motors (e.g., MTR-102, MTR-203) are built as control modules using a Device Control (DC) block, whose setpoint names come from a Named Set (e.g., mtr2-sp with states like Passive/Active). The DC block's SP_D properties let you browse available named sets." },

  /* ============================================================
   * CODING WITH PARAMETERS — PARAMETERS & FIELDS
   * ============================================================ */
  { manual: "fbref", topic: "Parameters & Fields", level: "beginner",
    front: "What is the difference between a parameter and a field in DeltaV?",
    back: "A parameter is a named, logical grouping of data (such as SP or PV) that exists in a function block. Each individual element of data within the parameter is called a field. For example, a parameter can carry a value (CV) and a status (ST) as separate fields." },

  { manual: "fbref", topic: "Parameters & Fields", level: "intermediate",
    front: "What do the three access columns (Configurable, Readable, Writeable) mean for a parameter field?",
    back: "Configurable = can be set in Control Studio or DeltaV Explorer (at configuration). Readable = can be read during runtime. Writeable = the value can be changed during runtime." },

  { manual: "fbref", topic: "Parameters & Fields", level: "intermediate",
    front: "What field holds the value of a simple floating-point or integer parameter, and can it be written at runtime?",
    back: "The .CV (Current Value) field. For floating point, integer, Boolean, named set, and option-bitstring parameters, CV is configurable, readable, and writeable at runtime." },

  { manual: "fbref", topic: "Parameters & Fields", level: "intermediate",
    front: "For a parameter 'with status' (e.g., floating point with status), what are the fields and their access?",
    back: "CV (the value) — configurable/readable/writeable — and ST (the status) — readable only (not configurable, not writeable). Use the ST field in status-sensitive calculations." },

  { manual: "fbref", topic: "Parameters & Fields", level: "expert",
    front: "What are the fields of a Mode parameter and which are writeable?",
    back: "TARGET (configurable, readable, writeable), ACTUAL (configurable, readable — not writeable), NORMAL (readable), PERMITTED (readable), ISAN, and ISTN (read-only). You set a mode by writing to the TARGET field and read the current mode from ACTUAL." },

  { manual: "fbref", topic: "Parameters & Fields", level: "expert",
    front: "What are the fields of a Scaling parameter (e.g., OUT_SCALE / PV_SCALE)?",
    back: "EU100 (upper range / 100% value), EU0 (lower range / 0% value), UNITS (engineering units — not writeable at runtime), and DECPT (decimal-point/precision). EU100, EU0, and DECPT are configurable, readable, and writeable." },

  { manual: "fbref", topic: "Parameters & Fields", level: "expert",
    front: "What are the fields of a Simulate parameter?",
    back: "ENABLE (turn simulation on/off), SSTATUS (the simulated status), and SVALUE (the simulated value). Simulation lets you drive a block's value/status for testing." },

  { manual: "fbref", topic: "Parameters & Fields", level: "expert",
    front: "What are the fields of a Named Set parameter?",
    back: "CV (current value, writeable), CVI (current value integer, read-only), SET (which named set, configurable), CVS (current value string, readable/writeable), and OPSEL (operator-selectable, configurable)." },

  /* ---- REFERENCE PARAMETERS ---- */
  { manual: "fbref", topic: "Parameter References", level: "intermediate",
    front: "What is an External Reference parameter and how is it written in an expression?",
    back: "An external reference lets you refer to any input, output, or parameter available in the DeltaV system (including other modules/nodes). In expressions it is denoted by surrounding the reference in single quotes (' '). Best practice: build the path with the parameter browser to avoid typos and case-sensitivity errors." },

  { manual: "fbref", topic: "Parameter References", level: "intermediate",
    front: "What does an external-reference path look like, e.g., to the MODE of PID1 in module FIC_501?",
    back: "The path is Module/Block/PARAM — for example FIC_501/PID1/MODE. A reference named EXT_REF1 pointing there could be used in phase logic as: IF '/EXT_REF1.ACTUAL' = MAN THEN OUT1 := 5.0 END_IF;" },

  { manual: "fbref", topic: "Parameter References", level: "intermediate",
    front: "What is an Internal Reference parameter, and when does its value update after a write?",
    back: "An internal reference refers to any input, output, or parameter available in the current module. A write to an internal reference changes the value of the referenced parameter; the internal reference parameter's own value changes at the beginning of the next scan of the module." },

  { manual: "fbref", topic: "Parameter References", level: "expert",
    front: "What is a Dynamic Reference parameter?",
    back: "A dynamic reference is a variation of the external reference that lets you define a path to a value selected at run time during algorithm execution — based on information not available at configuration (e.g., an operator entry, a recipe parameter from batch, or a run-time control value)." },

  { manual: "fbref", topic: "Parameter References", level: "expert",
    front: "When referencing a parameter field other than .CV, what must you do?",
    back: "You must type the field name explicitly (e.g., .ACTUAL, .ST, .CST). The .CV field is assumed by default; any other field must be named in the expression." },

  { manual: "fbref", topic: "Parameter References", level: "expert",
    front: "What does the .CST (Connection Status) field tell you, and what do its values mean?",
    back: "It tells whether a reference has been resolved (value found and readable) — useful when the parameter is in another node. Values: -3 = external reference not resolved; -2 = parameter not configured; -1 = module not configured; 0 = good; 1 = not communicating. It is read-only." },

  { manual: "fbref", topic: "Parameter References", level: "expert",
    front: "What does the .AWST (Asynchronous Write Status) field report?",
    back: "Whether the last attempt to write the referenced parameter succeeded. Values: -4 = write rejected; -3 = external reference not resolved; -2 = parameter not configured; -1 = module not configured; 0 = success; 1 = not communicating; 2 = write pending. Read-only." },

  { manual: "fbref", topic: "Parameter References", level: "expert",
    front: "How do you verify an external reference to another node before relying on it in an SFC?",
    back: "Use the .CST field in a CALC block or SFC expression. In a confirmation expression test .CST = 0 (connected) or < 0 (never going to connect). For SFC pulse/assignment actions, make sure the reference is bound before continuing the step (via pulse action confirmation or a transition condition)." },

  { manual: "fbref", topic: "Parameter References", level: "expert",
    front: "What limitation applies to writes to I/O references in another node?",
    back: "Writes from one node to an I/O reference in another node are NOT supported — and no messages or errors appear to indicate the write was unsuccessful." },

  { manual: "fbref", topic: "Parameter References", level: "expert",
    front: "What is the .$REF field of a reference parameter?",
    back: ".$REF provides a means to read the path currently in use by the reference. For an external reference it is configurable; for dynamic/internal references it holds the resolved path. It returns a String." },

  /* ---- EXTENSIBLE PARAMETERS ---- */
  { manual: "fbref", topic: "Extensible Parameters", level: "intermediate",
    front: "Which function blocks have extensible parameters?",
    back: "Add, And, Boolean Fan Input, Boolean Fan Output, Calculation/Logic, Multiply, Multiplex, Or, and Signal Selector. You can increase the number of inputs/outputs so you can wire more values without adding more blocks." },

  { manual: "fbref", topic: "Extensible Parameters", level: "intermediate",
    front: "How do you extend the inputs on an Add block?",
    back: "Select the block, right-click, and change the inputs number (e.g., from 2 to 4) in the extensible-parameters dialog. The additional parameters then appear on the diagram to be wired. Blocks can typically extend up to 16 inputs." },

  /* ---- NAMED SETS ---- */
  { manual: "fbref", topic: "Named Sets", level: "beginner",
    front: "What is a named set?",
    back: "A named set is a group of system- or user-defined, mutually exclusive descriptors, each assigned a numeric value from 0 to 255. Each descriptor is a text string representing one number; the operator or engineer selects one item from the list (e.g., for motor states, valve states, module states)." },

  { manual: "fbref", topic: "Named Sets", level: "intermediate",
    front: "Give the preconfigured two-state motor named set example (mtr2-sp).",
    back: "mtr2-sp contains STOP = 0 and START = 1. Assigning it to the SP of a motor control block lets an operator choose the motor's state in DeltaV Operate; selecting STOP writes 0 and START writes 1." },

  { manual: "fbref", topic: "Named Sets", level: "intermediate",
    front: "Are named sets case sensitive, and where are user-defined ones configured?",
    back: "Yes — named sets are case sensitive; all references to a state must match the original upper/lower case. User-defined named sets are configured in DeltaV Explorer via Setup | Named Set (right-click → New Named Set). States must be configured as user-selectable to be usable in the controller." },

  { manual: "fbref", topic: "Named Sets", level: "expert",
    front: "Which reserved words must you avoid in user-defined named sets, and why?",
    back: "Avoid NO(0), YES(1), MAN(8), AUTO(16), CAS(32,48), RCas(64), ROut(128), OOS(1), IMan(2), and LO(4). These are system state names and are always interpreted with those fixed values regardless of any user-defined value." },

  /* ---- OPTION BITSTRINGS ---- */
  { manual: "fbref", topic: "Option Bitstrings", level: "intermediate",
    front: "What is an option bitstring parameter, and in which modes can you set one?",
    back: "It is a parameter containing bit-encoded information where each bit enables an option. You can set control, I/O, and status options only when the block is in Manual or Out of Service mode." },

  { manual: "fbref", topic: "Option Bitstrings", level: "intermediate",
    front: "Name the types of option bitstrings in DeltaV.",
    back: "Control Options (CONTROL_OPTS), I/O Options (IO_OPTS), Status Options (STATUS_OPTS), Integration Options, Device Options, Algorithm Options, Input Options, FRSI Add-On Options, plus Interlock and Tracking options. Supported options vary by block." },

  { manual: "fbref", topic: "Option Bitstrings", level: "expert",
    front: "What does the 'Direct Acting' control option define?",
    back: "It defines the relationship between a change in PV and the corresponding change in output. When Direct Acting is enabled (True), an increase in PV results in an increase in the output (a decrease in PV decreases the output)." },

  { manual: "fbref", topic: "Option Bitstrings", level: "expert",
    front: "What does the 'Use PV for BKCAL_OUT' control option do?",
    back: "Normally BKCAL_OUT contains the working setpoint (SP_WRK). This option makes BKCAL_OUT use the process variable (PV) instead — but only when the block is in Cas mode; in non-Cas modes SP_WRK is still used." },

  { manual: "fbref", topic: "Option Bitstrings", level: "expert",
    front: "What do the 'Track Enable' and 'Track in Manual' control options do?",
    back: "Track Enable turns on external tracking: when TRK_IN_D is true (and target mode isn't MAN, or Track In Manual is selected), the block goes to LO and OUT is set to TRK_VAL. Track in Manual specifically permits external tracking when the target mode is MAN." },

  { manual: "fbref", topic: "Option Bitstrings", level: "expert",
    front: "What does the 'No OUT Limits in Manual' control option do?",
    back: "It does not apply OUT_HI_LIM or OUT_LO_LIM when target and actual modes are Man. OUT is still limited to no more than 10% outside the range of OUT_SCALE." },

  { manual: "fbref", topic: "Option Bitstrings", level: "expert",
    front: "What does the I/O option 'Low Cutoff' do?",
    back: "When the converted input value is below the LOW_CUT limit and Low Cutoff is enabled, a value of 0.0 is used for the converted value (PV). It is useful with zero-based measurement devices such as flowmeters." },

  { manual: "fbref", topic: "Option Bitstrings", level: "expert",
    front: "What do the I/O options 'Increase to Close' and 'Invert' do?",
    back: "Increase to Close indicates whether the output value is inverted before being sent to the I/O channel (e.g., for reverse-acting valves). Invert indicates whether a discrete input is logically inverted before being stored in the PV (0 → logical 0; non-zero → logical 1)." },

  { manual: "fbref", topic: "Option Bitstrings", level: "expert",
    front: "What does the status option 'Propagate Fault Backward' control?",
    back: "If the actuator status is Bad-Device Failure, Fault State Active, or Local Override, this option propagates it as the corresponding Bad/Good-Cascade substatus to BKCAL_OUT without generating an alarm. It lets you decide whether the block alarms locally or propagates upstream for alarming." },

  { manual: "fbref", topic: "Option Bitstrings", level: "expert",
    front: "What do the status options 'BAD if Limited' and 'Uncertain if Man mode' do?",
    back: "BAD if Limited sets the output status to Bad if the sensor is at or beyond a high/low limit. Uncertain if Man mode sets an input/calculation block's output status to Uncertain when the block's actual mode is Man." },

  /* ---- EXPRESSIONS / CODING ---- */
  { manual: "fbref", topic: "Expressions & Coding", level: "intermediate",
    front: "What assignment operator is used in DeltaV expressions (CALC/Logic and SFC actions)?",
    back: "The := operator. For example, OUT1 := 5.0 assigns 5.0 to OUT1. Expressions also support IF-THEN-ELSE-END_IF structures (each IF block terminated with END_IF;)." },

  { manual: "fbref", topic: "Expressions & Coding", level: "expert",
    front: "What does the Calculation/Logic (CALC) function block let you code?",
    back: "It evaluates a contained expression using as many as 16 inputs and 16 outputs and supports IF-THEN-ELSE-END_IF structures — letting you write logical and mathematical expressions (including references to other parameters via .CV, .ST, .CST, etc.) inside a module." },

  { manual: "fbref", topic: "Expressions & Coding", level: "expert",
    front: "Why should you avoid the equals (=) operator when comparing floating-point numbers?",
    back: "Because floating-point values are stored in finite bits, rounding differences may occur, preventing two 'equal' values from matching. DeltaV uses IEEE single-precision 32-bit floats (~7 significant decimal digits). Use range/inequality comparisons instead of =." },

  { manual: "fbref", topic: "Expressions & Coding", level: "expert",
    front: "What are the DeltaV floating-point limits and reliable precision?",
    back: "IEEE single-precision 32-bit: representable magnitude roughly ±3.4E38 (min positive ±2.34E-39). Resolution ≈ 7 significant decimal digits; reliable to about 6 significant digits when converting. Operations exceeding the limit clamp to the limit (e.g., 3.4E38 + 100 = 3.4E38)." },

  { manual: "fbref", topic: "Expressions & Coding", level: "expert",
    front: "In dynamic-reference expressions, how are string constants vs string variables written?",
    back: "A string constant is enclosed in double quotation marks (\" \"); a string variable is enclosed in single quotes (' '). Supported string functions include numeric-to-string and string-to-numeric conversion and equal/not-equal string comparison." },

  { manual: "fbref", topic: "Expressions & Coding", level: "intermediate",
    front: "What is the 'Quick Config' parameter filter group?",
    back: "Quick Config is a user parameter filter group containing parameters most often used to configure new modules. It has a default parameter list with default values to help configure a module quickly — but you should review each default and change values that aren't correct for your application. Other groups are User-defined 1 and User-defined 2." },

  { manual: "fbref", topic: "Expressions & Coding", level: "intermediate",
    front: "How do you set a mode from logic or an operator action, and how do you read the current mode?",
    back: "Write the desired mode to the MODE parameter's TARGET field; read the current operating mode from the ACTUAL field. Only permitted modes can be written to TARGET. In Fieldbus writes, use numeric mode values (e.g., AUTO=16, CAS=48 target)." },

  /* ============================================================
   * DELTAV LIVE — OVERVIEW & LIVE vs OPERATE
   * ============================================================ */
  { manual: "live", topic: "Live vs Operate", level: "beginner",
    front: "[Live] What is DeltaV Live and what does it replace?",
    back: "DeltaV Live is the modern operator graphics environment that REPLACES DeltaV Operate. It exists from DeltaV v14.3 onward; DeltaV Operate is scheduled to become obsolete in version 17.3. Live uses vector displays so you can zoom/rescale without loss of quality." },

  { manual: "live", topic: "Live vs Operate", level: "intermediate",
    front: "[Live vs Operate] Map the key nomenclature between DeltaV Live and DeltaV Operate.",
    back: "Live → Operate equivalents: GEM (Graphical Element) → Dynamo; Function → Lookup Table; Standard → Global Variable; Contextual Display → Faceplates/Details/Popup Pictures. Graphics Studio (Live) → Operate Configure/Run." },

  { manual: "live", topic: "Live vs Operate", level: "beginner",
    front: "[Live] Can DeltaV Live and DeltaV Operate run at the same time?",
    back: "Yes. They can run side by side on the same station. DeltaV Live can be enabled or disabled on all workstations EXCEPT the ProPlus (ProfessionalPLUS) station. Enabling/disabling is done through Workstation Management." },

  { manual: "live", topic: "Live vs Operate", level: "intermediate",
    front: "[Live] Name several features built into DeltaV Live that removed the need for scripting in Operate.",
    back: "Display levels, screen real-estate distribution and assignment, coordinated display navigation, and areas of responsibility per user — all built in. Live also adds class-based GEMs, line connectors/arrows, crossing-lines option, display hierarchy, and themes." },

  /* ---- WORKSTATION MANAGEMENT ---- */
  { manual: "live", topic: "Live: Workstation Mgmt", level: "intermediate",
    front: "[Live] What is Workstation Management used for, and where is it launched?",
    back: "Launched through DeltaV Live Administration, it enables/disables DeltaV Live per workstation (except ProPlus) and assigns layouts, display sets, and themes. It also configures Flexlock settings for DeltaV Live." },

  { manual: "live", topic: "Live: Workstation Mgmt", level: "intermediate",
    front: "[Live] What are the default DeltaV Live themes?",
    back: "Silver, Dark Blue, Dark Grey, Light Blue, and Tan. The Themes tab in Workstation Management assigns which themes are enabled for a workstation." },

  { manual: "live", topic: "Live: Workstation Mgmt", level: "intermediate",
    front: "[Live vs Operate] How does Saving/Publishing in DeltaV Live compare to DeltaV Operate?",
    back: "Saving and Publishing in DeltaV Live is analogous to Saving and Downloading in DeltaV Explorer/Operate. A publish icon appears next to workstations that need publishing; on publish, a popup lists all workstations needing it and you can choose which to publish (it also counts how many items will be published)." },

  /* ---- GRAPHICS STUDIO ---- */
  { manual: "live", topic: "Live: Graphics Studio", level: "beginner",
    front: "[Live vs Operate] What is Graphics Studio and how does it differ from Operate's editor?",
    back: "Graphics Studio is DeltaV Live's dedicated graphics editor. DeltaV Operate used two separate instances — Operate Configure and Operate Run — that could not run side by side. Graphics Studio can run together with DeltaV Live, and multiple instances of Graphics Studio can be open simultaneously." },

  { manual: "live", topic: "Live: Graphics Studio", level: "intermediate",
    front: "[Live] What are the three main areas of the Graphics Studio interface?",
    back: "1) Ribbon — menu bar of common commands/tasks. 2) Explorer Pane — manages Live configuration databases via two tabs: Library Explorer and Graphics Explorer. 3) Display/Documents Workspace — view/edit configuration (Palette, Selection, Graphics Configuration, and Content panes)." },

  { manual: "live", topic: "Live: Graphics Studio", level: "intermediate",
    front: "[Live] What is the parameter path notation in Graphics Studio? Give an example.",
    back: "Data Server[\"Module/Block/Parameter.Field\"]. Example: DLSYS[\"MTR-102/DC1/SP_D.CV\"]. DLSYS is the workstation's data server; the field is commonly CV (Current Value) or ST (Status)." },

  { manual: "live", topic: "Live: Graphics Studio", level: "beginner",
    front: "[Live] What is a Data Link in Graphics Studio and what are its three main types?",
    back: "A Data Link displays a module's value on the graphic. Three main types: String, Numeric, and Modes. Data Links can also allow write input (operator entry)." },

  { manual: "live", topic: "Live: Graphics Studio", level: "intermediate",
    front: "[Live] What are the five types of Interactions on a Graphics Studio object?",
    back: "Click, Double Click, Secondary Click (Right Click), Hover, and Drag. Interactions are actions that occur when the user interacts with the object (e.g., open a faceplate on click)." },

  { manual: "live", topic: "Live: Graphics Studio", level: "intermediate",
    front: "[Live] What is a Data Placeholder and how is it written?",
    back: "A Data Placeholder embeds live parameter data inside a text string. Assign a placeholder and insert {#} where the data should appear (# = placeholder number). Example label 'Flow on Tank 101 is: {1}' renders in Live as 'Flow on Tank 101 is: 28.7'." },

  { manual: "live", topic: "Live: Graphics Studio", level: "expert",
    front: "[Live] Distinguish the == , === , != , and !== operators in Graphics Studio.",
    back: "== Equal (0 == false → True). === Strict Equal, also checks type (0 === false → False, type mismatch). != Not Equal. !== Strict Not Equal. Also: >, <, >=, <= for magnitude comparisons." },

  { manual: "live", topic: "Live: Graphics Studio", level: "expert",
    front: "[Live] What is Quick Online View and what are its key cautions?",
    back: "Quick Online View (Review tab) lets you view a graphic without publishing/using DeltaV Live. Cautions: some limitations exist (e.g., faceplates do not work), and it is NOT a simulated environment — any changes to parameters affect REAL values." },

  { manual: "live", topic: "Live: Graphics Studio", level: "intermediate",
    front: "[Live] How do you add an animation to a graphic object?",
    back: "Select the diamond icon next to a property in the Graphics Configuration pane. Animations change a property (e.g., vertical fill of a rectangle for tank level, or colour) based on a parameter's value; you specify Fill and Scale parameters as needed." },

  { manual: "live", topic: "Live: Graphics Studio", level: "intermediate",
    front: "[Live] What is the Connector tool and connection anchor points?",
    back: "The connector tool connects equipment on a display with lines. Most preconfigured shapes and GEMs have connection anchor points — predetermined spots the connector line snaps to." },

  { manual: "live", topic: "Live: Graphics Studio", level: "intermediate",
    front: "[Live] What does the Verification Tool do, and how are issues categorized?",
    back: "The Verification Tool parses a graphic for issues before publishing. Results are categorized by severity as Error, Warning, or Information based on how critical the issue is." },

  { manual: "live", topic: "Live: Graphics Studio", level: "expert",
    front: "[Live vs Operate] What are the publishing advantages of DeltaV Live over Operate?",
    back: "Live publishes individual displays instead of downloading the whole Operator Station, so the station need not be 'locked' during download. You can publish to an offline workstation (it updates when back online), delete displays without them returning, and use targeted publishing to specific workstations. A display can have at most two revisions at once." },

  { manual: "live", topic: "Live: Graphics Studio", level: "intermediate",
    front: "[Live] Which configurations must be published to take effect?",
    back: "DeltaV Live-enabled workstations, Languages, Themes, Displays, Display Sets, Contextual Displays, Layouts, Standards, and Functions. When any of these are created or modified they must be published to update." },

  /* ---- DELTAV LIVE RUNTIME ---- */
  { manual: "live", topic: "Live: Runtime", level: "beginner",
    front: "[Live] Why does DeltaV Live use vector displays?",
    back: "Vector displays let the user zoom in or rescale without loss of quality — unlike raster graphics. This supports high-DPI monitors and flexible layouts." },

  { manual: "live", topic: "Live: Runtime", level: "intermediate",
    front: "[Live vs Operate] What replaces the Operate toolbar, and what is the Navigation Bar?",
    back: "The Menu Bar replaces the DeltaV Operate toolbar, giving the operator access to tools and applications (buttons can be enabled/disabled). The Navigation Bar moves the user between pages quickly and can be configured as a flat list (like Operate) or a hierarchical list." },

  { manual: "live", topic: "Live: Layouts & Displays", level: "intermediate",
    front: "[Live] What is a Layout, and which monitor configurations are supported?",
    back: "A Layout defines where displays appear and lets users arrange/configure display contents. Single, Dual, and Quad monitor layouts are supported; multiple displays can be placed on one screen (useful for large monitors)." },

  { manual: "live", topic: "Live: Layouts & Displays", level: "intermediate",
    front: "[Live] Within a layout, what is the difference between Screens and Display Frames?",
    back: "Screens represent the operator's physical monitor setup (Single, Dual, or Quad). Display Frames are the graphical elements/containers shown on the screen where displays are rendered." },

  { manual: "live", topic: "Live: Layouts & Displays", level: "intermediate",
    front: "[Live] What is a Display Set?",
    back: "A Display Set is a collection of grouped displays so operators access only the displays relevant to their duties. A workstation can be configured to access only that set, and display sets provide built-in navigation across the displays." },

  { manual: "live", topic: "Live: Layouts & Displays", level: "expert",
    front: "[Live] Contrast Non-Hierarchical and Hierarchical displays in a Display Set.",
    back: "Non-Hierarchical: collect displays not in a specific group and limit operator access (though operators can still reach others via on-screen links or the alarm banner); you must uncheck 'Include All Displays' to add them. Hierarchical: grouped into 4 levels (Level 1 = overview), multiple displays per level — useful for plant-wide sets with a hierarchy per area; the layout must enable the display-hierarchy option and set the number of levels." },

  { manual: "live", topic: "Live: Layouts & Displays", level: "expert",
    front: "[Live] What is Automatic Display Coordination and its three frame options?",
    back: "A layout can auto-coordinate frames so that when one frame opens a level display, other frames change content to show hierarchically related displays together (maintaining situational awareness). Options: Auto-Coordinate Higher Levels; Prevent External Coordination (displays from this frame's nav bar open in other frames); Auto-open Display Levels (this frame auto-opens the selected hierarchy level)." },

  /* ---- GEMs ---- */
  { manual: "live", topic: "Live: GEMs", level: "beginner",
    front: "[Live vs Operate] What is a GEM and what does it replace?",
    back: "A GEM (Graphical Element) is DeltaV Live's reusable graphic object; it REPLACES DeltaV Operate's Dynamo. GEM classes act like module classes: change the GEM class and the change propagates to all GEM instances based on it." },

  { manual: "live", topic: "Live: GEMs", level: "intermediate",
    front: "[Live] What are High Performance GEMs?",
    back: "A set of GEMs designed on Human-Centered Design principles: alarm and status information is always in the same location, and data is shown in effective ways (e.g., bar graphs instead of data links). They exist for equipment such as pumps, analog valves, and discrete valves." },

  { manual: "live", topic: "Live: GEMs", level: "expert",
    front: "[Live] What do the GEM status icons Mode, Not Running, and Bad IO indicate?",
    back: "Mode: block mode not as expected (PID: MODE.ACTUAL≠NORMAL or ≠TARGET; DC: TARGET/ACTUAL≠NORMAL or permissive active). Not Running: MSTATUS is Out of Service, Breakpoint Set, or Not Running. Bad IO: BLOCK_ERR has Out of Service/Readback Failed/Output Failure/Input Failure/Other Error — never shown when Not Running is shown." },

  { manual: "live", topic: "Live: GEMs", level: "expert",
    front: "[Live] What do the GEM icons Simulate Active, No Permit, Interlock Bypassed, and Interlocked mean?",
    back: "Simulate Active: block is being simulated (hidden if Not Running or Bad IO shown). No Permit: a permissive condition is active. Interlock Bypassed: the BYPASSED parameter is active. Interlocked: the DC block's DC_STATE is Shutdown/Interlocked." },

  { manual: "live", topic: "Live: GEMs", level: "expert",
    front: "[Live] Decode the GEM naming convention using HP_MA3_CV_ML.",
    back: "HP = High Performance; M = Module; A = Analog (vs Discrete); 3 = number of function-block types the GEM works with (e.g., AI, ALM, PID); then bar-graph type (C=Combination, D=Deviation, N=None, NML=Normalized, V=Vertical, H=Horizontal); then size (S=Small, M=Medium); plus equipment codes like PMP=Pump, VLV=Valve." },

  { manual: "live", topic: "Live: GEMs", level: "intermediate",
    front: "[Live] What are the GEM Class Tools in the ribbon (Design, Notify, etc.)?",
    back: "Design: launches the GEM Configuration Designer to define configurable GEM parameters. Resize to Fit Contents: resizes the canvas. Connection Point Tool: creates connection anchor points. Notify: sets all displays using the GEM to 'Work in Progress' when the GEM class is modified." },

  { manual: "live", topic: "Live: GEMs", level: "intermediate",
    front: "[Live] What is the GEM Configuration Designer and the most common GEM property?",
    back: "It provides tools to create configurable properties that appear for a GEM. The most common property is one to enter the module name linked to the GEM. Property groups must be added before adding properties." },

  { manual: "live", topic: "Live: GEMs", level: "expert",
    front: "[Live] How do you reference a GEM property in a data link, e.g., for a generic module name?",
    back: "Reference a GEM property with Gem.PropertyName. Replace the hard-coded module name with the placeholder. If the module-name property is ModName, the path becomes: DLSYS[Gem.ModName + \"/DC1/SP_D.CV\"]." },

  { manual: "live", topic: "Live: GEMs", level: "intermediate",
    front: "[Live] What are the two ways to create a GEM?",
    back: "1) From scratch using a combination of shapes, data links, text, and functions. 2) By selecting objects on a display and choosing 'Convert to Linked GEM' — then add a GEM property for the Control Tag and assign it to a generic data link so it works for multiple modules." },

  { manual: "live", topic: "Live: GEMs", level: "expert",
    front: "[Live vs DeltaV] Contrast linked vs unlinked GEMs.",
    back: "A linked GEM stays connected to its GEM class — any class change affects it. An unlinked GEM is not affected by class changes (analogous to converting a module to classless in DeltaV). Individual properties of a linked GEM can still be overridden (e.g., changing a line's colour from the display's Graphics Configuration pane)." },

  { manual: "live", topic: "Live: GEMs", level: "intermediate",
    front: "[Live] How do you find which displays use a particular GEM?",
    back: "Open the GEM and go to File → Info while the GEM is open; it lists the displays using that GEM (References)." },

  { manual: "live", topic: "Live: GEMs", level: "intermediate",
    front: "[Live] What is the Custom Selection GEM property?",
    back: "A configuration property that creates a custom selection list for the user to choose from — up to 16 options can be created." },

  { manual: "live", topic: "Live: GEMs", level: "intermediate",
    front: "[Live] What is the Chart Builder feature on High Performance GEMs?",
    back: "High Performance GEMs let you create charts easily: right-click the GEM and add the desired parameter to the Chart Builder." },

  /* ---- FUNCTIONS ---- */
  { manual: "live", topic: "Live: Functions", level: "intermediate",
    front: "[Live vs Operate] What is a Function and what does it replace?",
    back: "A Function creates logic that converts a value of one type into a value of a different type (the DeltaV Live equivalent of an Operate Lookup Table). Inputs can be floats, strings, or Booleans; outputs can be colours, fonts, Booleans, images, strings, measurements, or numbers." },

  { manual: "live", topic: "Live: Functions", level: "expert",
    front: "[Live] How many inputs/calculations can a Function have, and in what order do calculations run?",
    back: "A Function can use 1 to 5 inputs and up to 5 calculations. When executing in DeltaV, calculations run from top to bottom as they appear in Graphics Studio." },

  { manual: "live", topic: "Live: Functions", level: "expert",
    front: "[Live] What are the three conversion-table logic types in a Function?",
    back: "Rule Based: rules define input→output (e.g., Avg_Press < 1 → Red, > 1 → Green). Value Based: compares a single value to several choices and returns the matching value (e.g., 0–1 → Red, 1–2 → Green). Script Based: write custom expressions to define input/output types." },

  /* ---- CONTEXTUAL DISPLAYS ---- */
  { manual: "live", topic: "Live: Contextual Displays", level: "intermediate",
    front: "[Live vs Operate] What are Contextual Displays and what do they replace?",
    back: "Contextual Displays are graphics whose content depends on the context they open in — the DeltaV Live equivalent of Operate's Faceplates, Detail faceplates, and Popup Pictures. A single graphic configuration can be shared by different DeltaV objects and launched via a configured interaction (e.g., click)." },

  { manual: "live", topic: "Live: Contextual Displays", level: "expert",
    front: "[Live] How do you reference the context tag in a contextual display?",
    back: "Use Dsp.Tag. For example: DLSYS[Dsp.Tag + \"/PID1/SP.CV\"]. The Dsp.Tag resolves to whichever object opened the contextual display." },

  { manual: "live", topic: "Live: Contextual Displays", level: "intermediate",
    front: "[Live] Best practice for building a faceplate from scratch?",
    back: "Start from a template. Existing library templates contain useful operator scripts (e.g., acknowledging alarms, bottom buttons). You can also customize existing faceplates/detail faceplates when only a small change is needed." },

  { manual: "live", topic: "Live: Contextual Displays", level: "intermediate",
    front: "[Live] What is a Watch Area?",
    back: "A Watch Area lets the user monitor desired parameters for an extended period. GEMs can be dragged into the watch area, and a watch area can be made part of a layout by creating a display frame with a watch area." },

  /* ---- IMPORT/EXPORT & CONVERSION ---- */
  { manual: "live", topic: "Live: Import/Export", level: "intermediate",
    front: "[Live vs Operate] How does graphics storage/transfer differ in Live vs Operate?",
    back: "Unlike DeltaV Operate, Live graphics are NOT stored in a folder you can copy/paste — all graphics are controlled through DeltaV Graphics Studio. To bring images in, use Import; to send them out, use Export." },

  { manual: "live", topic: "Live: Conversion", level: "intermediate",
    front: "[Live] What are the steps to convert DeltaV Operate graphics to DeltaV Live?",
    back: "1) Import the Conversion Toolbar into DeltaV Operate Configure mode. 2) Use the ExportToDeltaVLive utility in DeltaV Operate. 3) Import the files into DeltaV Live. 4) Check the log files to fix any conversion issues." },

  { manual: "live", topic: "Live: Conversion", level: "expert",
    front: "[Live] What happens to Dynamos during conversion, and how do you troubleshoot issues?",
    back: "Standard DeltaV Operate Dynamos are converted to DeltaV GEMs; some pictures need reformatting afterward. The error log shows broken dynamos/datalinks. Search DeltaV Books Online for 'Conversion Issues and Solutions', and search the migration error code (e.g., #mig0027#) within the migrated graphics in Graphics Studio." },

  /* ---- ADMINISTRATION ---- */
  { manual: "live", topic: "Live: Administration", level: "intermediate",
    front: "[Live] What tools are available in DeltaV Live Administration?",
    back: "Similar to the DeltaV Database Administration tool. Tools: Workstation Management (enable/disable Live and settings), DeltaV Live Diagnostics (health of Live workstations), Event Viewer (Live event log, e.g., replacing/removing displays), SQL Data Sources (connect to SQL databases), and Database Management." },

  { manual: "live", topic: "Live: Administration", level: "expert",
    front: "[Live] What database operations does DeltaV Live Administration provide?",
    back: "Start/stop the Database Server; Show Active Connections (list/disconnect connected workstations); Copy, Create, Delete, Export, Import, Rename, Switch (mainly for PK controllers), Backup, and Restore Database. Export creates individual files per object, whereas Backup creates one file that includes everything." },

  /* ---- SCRIPTING ---- */
  { manual: "live", topic: "Live: Scripting", level: "intermediate",
    front: "[Live vs Operate] What scripting language does DeltaV Live use?",
    back: "DeltaV Live uses TypeScript (Operate used VBA-style scripting). Uses include for/while loops and if statements. Graphics Studio Help is a good starting point, and DeltaV Books Online covers general DeltaV help. Note: many tasks that needed scripting in Operate are now built into Live." },

  /* ---- BEST PRACTICES ---- */
  { manual: "live", topic: "Live: Best Practices", level: "intermediate",
    front: "[Live] Best practice: how should GEMs be built so one graphic works for many modules?",
    back: "Build GEMs as linked GEM classes with a configurable Control-Tag/Module-Name property (e.g., ModName) and reference it generically: DLSYS[Gem.ModName + \"/DC1/SP_D.CV\"]. Then a single class change propagates to every instance, and each instance just supplies its module name." },

  { manual: "live", topic: "Live: Best Practices", level: "intermediate",
    front: "[Live] Best practice: prefer High Performance GEMs — why?",
    back: "High Performance GEMs follow Human-Centered Design: alarm/status always in the same place and data shown as bar graphs rather than raw numbers. This improves situational awareness and faster abnormal-condition detection than dense numeric displays." },

  { manual: "live", topic: "Live: Best Practices", level: "expert",
    front: "[Live] Best practice: verify and publish safely.",
    back: "Run the Verification Tool before publishing to catch Errors/Warnings. Use targeted publishing to update only affected workstations (no station lock, offline stations update when back online). Remember Quick Online View is NOT simulated — changes hit real values — so use a real test strategy for logic." },

  { manual: "live", topic: "Live: Best Practices", level: "intermediate",
    front: "[Live] Best practice: organize operator access with display sets and hierarchy.",
    back: "Use Display Sets to give operators only the displays relevant to their duties, and Hierarchical displays (4 levels, Level 1 = overview) with Automatic Display Coordination so related displays appear together across frames — maximizing situational awareness. Use Non-Hierarchical groups for the rest." }
];

// Expose for the app
if (typeof window !== "undefined") { window.DV_MANUALS = DV_MANUALS; window.DV_CARDS = DV_CARDS; }
