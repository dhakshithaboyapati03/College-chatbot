package com.collegefinder.backend.college;
import java.util.List;
public record College(Long id, String name, String city, String state, String description, String hostel, String placements, List<Course> courses) {}
