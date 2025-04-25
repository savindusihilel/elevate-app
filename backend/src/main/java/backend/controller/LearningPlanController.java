package backend.controller;

import backend.exception.LearningPlanNotFoundException;
import backend.model.LearningPlanModel;
import backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class LearningPlanController {
    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @PostMapping("/learningPlan")
    public LearningPlanModel newLearningPlanModel(@RequestBody LearningPlanModel newLearningPlanModel) {
        newLearningPlanModel.setCreatedAt(LocalDateTime.now());
        return learningPlanRepository.save(newLearningPlanModel);
    }

    @GetMapping("/learningPlan")
    List<LearningPlanModel> getAll() {
        return learningPlanRepository.findAll();
    }

    @GetMapping("/learningPlan/{id}")
    public LearningPlanModel getById(@PathVariable String id) {
        return learningPlanRepository.findById(id)
                .orElseThrow(() -> new LearningPlanNotFoundException(id));
    }

    @PutMapping("/learningPlan/{id}")
    LearningPlanModel update(@RequestBody LearningPlanModel newLearningPlanModel, @PathVariable String id) {
        return learningPlanRepository.findById(id)
                .map(learningPlanModel -> {
                    learningPlanModel.setTitle(newLearningPlanModel.getTitle());
                    learningPlanModel.setDescription(newLearningPlanModel.getDescription());
                    learningPlanModel.setSkills(newLearningPlanModel.getSkills());
                    learningPlanModel.setPostOwnerID(newLearningPlanModel.getPostOwnerID());
                    learningPlanModel.setPostOwnerName(newLearningPlanModel.getPostOwnerName());
                    return learningPlanRepository.save(learningPlanModel);
                }).orElseThrow(() -> new LearningPlanNotFoundException(id));
    }

    @DeleteMapping("/learningPlan/{id}")
    public void delete(@PathVariable String id) {
        learningPlanRepository.deleteById(id);
    }

    @PostMapping("/learningPlan/filterBySkills")
    public List<LearningPlanModel> getPostsBySkills(@RequestBody List<String> skills) {
        return learningPlanRepository.findAll().stream()
                .filter(post -> post.getSkills().stream()
                        .anyMatch(skill -> skills.contains(skill.toUpperCase())))
                .toList();
    }
}
