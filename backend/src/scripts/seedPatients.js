import supabase from "../config/supabaseClient.js";
import dotenv from "dotenv";

dotenv.config();

const samplePatients = [
  {
    first_name: "Juan",
    last_name: "Dela Cruz",
    school_email: "juan.delacruz@adezu.edu.ph",
    id_number: "ADEZU2024001",
    role: "Student",
    department: "Engineering",
    phone_number: "09175551234"
  },
  {
    first_name: "Maria",
    last_name: "Santos",
    school_email: "maria.santos@adezu.edu.ph",
    id_number: "ADEZU2024002",
    role: "Student",
    department: "Business Administration",
    phone_number: "09175555678"
  },
  {
    first_name: "Carlos",
    last_name: "Rodriguez",
    school_email: "carlos.rodriguez@adezu.edu.ph",
    id_number: "ADEZU2024003",
    role: "Staff",
    department: "Infirmary",
    phone_number: "09175559999"
  },
  {
    first_name: "Ana",
    last_name: "Garcia",
    school_email: "ana.garcia@adezu.edu.ph",
    id_number: "ADEZU2024004",
    role: "Student",
    department: "Education",
    phone_number: "09175553333"
  },
  {
    first_name: "Miguel",
    last_name: "Torres",
    school_email: "miguel.torres@adezu.edu.ph",
    id_number: "ADEZU2024005",
    role: "Student",
    department: "Science",
    phone_number: "09175557777"
  }
];

async function seedPatients() {
  try {
    console.log("[seedPatients] Starting to insert sample patients...\n");

    for (const patient of samplePatients) {
      const { data, error } = await supabase
        .from("patient")
        .insert([patient])
        .select();

      if (error) {
        console.error(`❌ Error inserting ${patient.first_name} ${patient.last_name}:`, error.message);
      } else {
        console.log(`✅ Successfully inserted: ${patient.first_name} ${patient.last_name} (ID: ${data[0].uuid})`);
      }
    }

    console.log("\n[seedPatients] ✨ Patient seeding completed!");

    // Verify data
    const { data: allPatients, error: fetchError } = await supabase
      .from("patient")
      .select("*");

    if (fetchError) {
      console.error("Error fetching patients:", fetchError.message);
    } else {
      console.log(`\n📊 Total patients in database: ${allPatients.length}`);
    }

  } catch (error) {
    console.error("[seedPatients] Unexpected error:", error.message);
  }
}

// Run the seeding script
seedPatients();
